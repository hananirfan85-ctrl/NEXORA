import React, { useEffect, useState } from 'react';
import { supabase, Product } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { formatCurrency } from '../lib/utils';
import { Search, Plus, Minus, Trash2, Printer, CheckCircle, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type CartItem = Product & { cartQuantity: number };

export default function POS() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  const [processing, setProcessing] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [completedSale, setCompletedSale] = useState<{ id: string, amount: number, items: CartItem[], cashReceived: number, change: number } | null>(null);

  const [showClearCart, setShowClearCart] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [cashReceived, setCashReceived] = useState('');

  const cartTotal = cart.reduce((sum, item) => sum + (item.selling_price * item.cartQuantity), 0);
  const cartProfit = cart.reduce((sum, item) => sum + ((item.selling_price - item.cost_price) * item.cartQuantity), 0);

  const clearEntireCart = () => {
    setCart([]);
    setShowClearCart(false);
  };

  const handleCheckoutClick = () => {
    if (cart.length === 0 || !user) return;
    setCashReceived(cartTotal.toString());
    setShowPaymentModal(true);
  };

  useEffect(() => {
    if (user) fetchProducts();
  }, [user]);

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*').order('name');
    if (data) {
      setProducts(data);
      const cats = Array.from(new Set(data.map(d => d.category)));
      setCategories(['All', ...cats]);
    }
  };

  const addToCart = (product: Product) => {
    if (product.stock <= 0) return alert('Out of stock');
    const existing = cart.find(c => c.id === product.id);
    if (existing) {
      if (existing.cartQuantity >= product.stock) return;
      setCart(cart.map(c => c.id === product.id ? { ...c, cartQuantity: c.cartQuantity + 1 } : c));
    } else {
      setCart([...cart, { ...product, cartQuantity: 1 }]);
    }
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(cart.map(c => {
      if (c.id === id) {
        const newQ = c.cartQuantity + delta;
        if (newQ > c.stock) return c;
        if (newQ <= 0) return c;
        return { ...c, cartQuantity: newQ };
      }
      return c;
    }));
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(c => c.id !== id));
  };

  const filteredProducts = products.filter(p => {
    const searchMatch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const categoryMatch = selectedCategory === 'All' || p.category === selectedCategory;
    return searchMatch && categoryMatch;
  });

  const completeSale = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (cart.length === 0 || !user) return;
    setProcessing(true);

    const receivedAmount = parseFloat(cashReceived) || cartTotal;
    const changeAmount = receivedAmount - cartTotal;

    // Call Supabase RPC
    const itemsJson = cart.map(item => ({
      product_id: item.id,
      quantity: item.cartQuantity,
      unit_price: item.selling_price,
      unit_cost: item.cost_price,
      total_price: item.selling_price * item.cartQuantity,
      total_profit: (item.selling_price - item.cost_price) * item.cartQuantity
    }));

    const { data: saleId, error } = await supabase.rpc('process_sale', {
      p_user_id: user.id,
      p_total_amount: cartTotal,
      p_total_profit: cartProfit,
      p_items: itemsJson
    });

    if (error) {
      console.error('Error processing sale:', error);
      alert('Error processing sale. Is your Supabase RPC set up? Check the console.');
      // Fallback: manually insert if RPC is missing, but constraints require RPC for atomic operations
    } else {
      setCompletedSale({ id: saleId, amount: cartTotal, items: [...cart], cashReceived: receivedAmount, change: changeAmount });
      setShowReceipt(true);
      setShowPaymentModal(false);
      setCart([]);
      fetchProducts(); // Refresh stock
    }
    setProcessing(false);
  };

  const handlePrint = () => {
    if (!completedSale) return;

    const bName = localStorage.getItem('nexora_business_name') || 'NEXORA POS';
    const address = localStorage.getItem('nexora_address') || 'Nexus Supermarket\n123 Street';
    const footer = localStorage.getItem('nexora_footer') || 'Thank you for shopping with us!';

    const printContent = `
      <html>
        <head>
          <title>Receipt - ${completedSale.id}</title>
          <style>
            body { font-family: monospace; width: 300px; margin: 0 auto; color: #000; padding: 20px; }
            .center { text-align: center; }
            .bold { font-weight: bold; }
            .line { border-bottom: 1px dashed #000; margin: 10px 0; }
            .item-row { display: flex; justify-content: space-between; margin-bottom: 5px; }
            .amount { text-align: right; }
            @media print {
              body { width: 100%; margin: 0; padding: 0; }
            }
          </style>
        </head>
        <body>
          <div class="center">
            <h2 style="margin: 0 0 5px 0;">${bName}</h2>
            <p style="margin: 0; white-space: pre-wrap; font-size: 12px;">${address}</p>
          </div>
          
          <div class="line"></div>
          <div style="font-size: 12px; margin-bottom: 10px;">
            Receipt: #${completedSale.id.split('-')[0].toUpperCase()}<br/>
            Date: ${new Date().toLocaleString()}<br/>
          </div>
          <div class="line"></div>

          ${completedSale.items.map(item => `
            <div class="item-row">
              <span style="flex: 1;">${item.cartQuantity}x ${item.name}</span>
              <span class="amount">${formatCurrency(item.selling_price * item.cartQuantity)}</span>
            </div>
            <div style="font-size: 10px; color: #333; margin-bottom: 4px;">@ ${formatCurrency(item.selling_price)} / unit</div>
          `).join('')}

          <div class="line"></div>
          <div class="item-row bold" style="font-size: 16px; margin-top: 5px;">
            <span>TOTAL</span>
            <span>${formatCurrency(completedSale.amount)}</span>
          </div>
          <div class="item-row" style="font-size: 12px; margin-top: 2px;">
            <span>Cash</span>
            <span>${formatCurrency(completedSale.cashReceived)}</span>
          </div>
          <div class="item-row" style="font-size: 12px; margin-top: 2px;">
            <span>Change</span>
            <span>${formatCurrency(completedSale.change)}</span>
          </div>
          <div class="line"></div>

          <div class="center" style="margin-top: 15px; font-size: 12px; white-space: pre-wrap;">
            ${footer}
          </div>
        </body>
      </html>
    `;

    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    iframe.contentWindow?.document.open();
    iframe.contentWindow?.document.write(printContent);
    iframe.contentWindow?.document.close();
    
    setTimeout(() => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
    }, 500);
  };

  if (showReceipt) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm text-center">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sale Complete!</h2>
          <p className="text-sm text-gray-500 mb-6">Receipt ID: {completedSale?.id?.split('-')[0].toUpperCase()}</p>
          
          <div className="border-t border-b py-4 my-6 border-dashed space-y-2">
            <div className="flex justify-between font-medium"><span>Amount Paid</span><span>{formatCurrency(completedSale?.amount || 0)}</span></div>
            <div className="flex justify-between text-gray-500 text-sm mt-1"><span>Cash Received</span><span>{formatCurrency(completedSale?.cashReceived || 0)}</span></div>
            <div className="flex justify-between text-emerald-600 font-bold mt-2"><span>Change Returned</span><span>{formatCurrency(completedSale?.change || 0)}</span></div>
          </div>

          <div className="flex gap-4 justify-center">
            <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors font-medium">
              <Printer size={18} /> Print
            </button>
            <button onClick={() => setShowReceipt(false)} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium">
              New Sale
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="h-full flex flex-col lg:flex-row gap-6">
      {/* Product Selection */}
      <div className="flex-1 flex flex-col min-h-[500px] lg:min-h-0 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search products to add..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
            />
          </div>
          <div className="flex overflow-x-auto pb-2 gap-2 hide-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === cat 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
            <AnimatePresence>
              {filteredProducts.map((product) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={product.id}
                  onClick={() => addToCart(product)}
                  className={`relative p-4 rounded-xl border cursor-pointer transition-all ${
                    product.stock > 0 
                      ? 'border-gray-100 hover:border-indigo-400 hover:shadow-md bg-white active:scale-95' 
                      : 'border-red-100 bg-red-50/50 opacity-70 cursor-not-allowed'
                  }`}
                >
                  <h3 className="font-semibold text-gray-900 line-clamp-2 min-h-[2.5rem] leading-tight">
                    {product.name}
                  </h3>
                  <div className="mt-3 flex items-end justify-between">
                    <div>
                      <span className="block text-xs text-gray-500 mb-0.5">{product.category}</span>
                      <span className="font-bold text-indigo-600">{formatCurrency(product.selling_price)}</span>
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-md ${product.stock <= 5 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
                      {product.stock} left
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Cart Checkout */}
      <div className="w-full lg:w-[400px] flex flex-col h-[500px] lg:h-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden shrink-0">
        <div className="p-4 bg-gray-50 border-b border-gray-100 shrink-0">
          <h2 className="font-bold text-gray-900 flex justify-between items-center">
            <span>Current Order</span>
            <div className="flex items-center gap-2">
              <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full">{cart.length} items</span>
              {cart.length > 0 && (
                <button onClick={() => setShowClearCart(true)} className="text-gray-400 hover:text-red-600 transition-colors bg-white border border-gray-200 p-1 rounded-full shadow-sm ml-2">
                   <Trash2 size={14} />
                </button>
              )}
            </div>
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-2">
              <ShoppingCart size={48} className="opacity-20" />
              <p>Cart is empty</p>
            </div>
          ) : (
            <AnimatePresence>
              {cart.map(item => (
                <motion.div layout initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} key={item.id} className="flex flex-col gap-2 p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex justify-between items-start leading-tight">
                    <span className="font-medium text-gray-900 pr-2">{item.name}</span>
                    <span className="font-bold text-gray-900 shrink-0">{formatCurrency(item.selling_price * item.cartQuantity)}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm text-gray-500">{formatCurrency(item.selling_price)} / unit</span>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center bg-white rounded-md border border-gray-200">
                        <button onClick={() => updateQuantity(item.id, -1)} className="p-1 sm:p-2 hover:bg-gray-100 text-gray-600 transition-colors"><Minus size={14} /></button>
                        <span className="w-8 text-center text-sm font-medium">{item.cartQuantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="p-1 sm:p-2 hover:bg-gray-100 text-gray-600 transition-colors"><Plus size={14} /></button>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 transition-colors p-2 shrink-0">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-100 space-y-4 shrink-0">
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatCurrency(cartTotal)}</span>
            </div>
            <div className="flex justify-between font-bold text-gray-900 text-lg pt-2 border-t border-gray-200">
              <span>Total Pay</span>
              <span>{formatCurrency(cartTotal)}</span>
            </div>
          </div>
          <button
            onClick={handleCheckoutClick}
            disabled={cart.length === 0 || processing}
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] disabled:bg-gray-300 disabled:active:scale-100 text-white font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
          >
            {processing ? 'Processing...' : 'Checkout'}
            {!processing && <span className="opacity-70 font-normal">| {formatCurrency(cartTotal)}</span>}
          </button>
        </div>
      </div>

      {/* Clear Cart Modal */}
      {showClearCart && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden p-6 text-center"
          >
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <Trash2 className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Clear Order</h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to completely clear the current order?
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowClearCart(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 w-full"
              >
                Cancel
              </button>
              <button
                onClick={clearEntireCart}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 w-full"
              >
                Clear Cart
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Payment Entry Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden p-6"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Complete Payment</h3>
            <form onSubmit={completeSale}>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-500 font-medium">Total Amount Due</span>
                  <span className="text-xl font-bold text-gray-900">{formatCurrency(cartTotal)}</span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cash Received</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">Rs</span>
                    <input
                      type="number"
                      autoFocus
                      required
                      min={cartTotal} // Ensure they enter enough or default to total
                      step="0.01"
                      value={cashReceived}
                      onChange={(e) => setCashReceived(e.target.value)}
                      onFocus={(e) => e.target.select()}
                      className="w-full pl-9 pr-4 py-3 text-lg font-bold border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>
                
                {parseFloat(cashReceived) >= cartTotal && (
                  <div className="flex justify-between items-center py-3 bg-emerald-50 px-4 rounded-lg border border-emerald-100">
                    <span className="text-emerald-800 font-medium">Change to Return</span>
                    <span className="text-xl font-bold text-emerald-700">{formatCurrency((parseFloat(cashReceived) || cartTotal) - cartTotal)}</span>
                  </div>
                )}
              </div>
              <div className="flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 w-full transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={processing || (parseFloat(cashReceived) < cartTotal)}
                  className="px-4 py-3 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 disabled:bg-indigo-300 w-full transition-colors flex justify-center items-center gap-2"
                >
                  {processing ? 'Processing...' : 'Confirm Payment'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
