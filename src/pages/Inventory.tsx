import React, { useEffect, useState } from 'react';
import { supabase, Product } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { formatCurrency } from '../lib/utils';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function Inventory() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form state
  const [formLoad, setFormLoad] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [storeType, setStoreType] = useState<string>('general');
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    cost_price: 0,
    selling_price: 0,
    stock: 0,
    unit: '',
  });

  const categories = Array.from(new Set(products.map(p => p.category)));

  useEffect(() => {
    if (user) {
      fetchProducts();
      fetchStoreSettings();
    }
  }, [user]);

  const fetchStoreSettings = async () => {
    const { data } = await supabase.from('store_settings').select('store_type').eq('user_id', user?.id).maybeSingle();
    if (data) setStoreType(data.store_type);
  };

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching products:', error);
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  };

  const logActivity = async (action: string, description: string) => {
    if (!user) return;
    await supabase.from('activity_logs').insert([{
      user_id: user.id,
      action,
      description
    }]);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setFormLoad(true);

    if (editingId) {
      const { data, error } = await supabase
        .from('products')
        .update({
          name: formData.name,
          category: formData.category,
          cost_price: formData.cost_price,
          selling_price: formData.selling_price,
          stock: formData.stock,
          unit: formData.unit
        })
        .eq('id', editingId)
        .select()
        .single();

      if (!error && data) {
        logActivity('UPDATE_PRODUCT', `Updated product: ${formData.name}`);
        setProducts(prev => prev.map(p => p.id === editingId ? data : p));
        closeModal();
      }
    } else {
      const { data, error } = await supabase
        .from('products')
        .insert([{
          user_id: user.id,
          ...formData
        }])
        .select()
        .single();

      if (!error && data) {
        logActivity('ADD_PRODUCT', `Added new product: ${formData.name}`);
        setProducts(prev => [data, ...prev]);
        closeModal();
      }
    }
    setFormLoad(false);
  };

  // Delete State
  const [deleteCandidate, setDeleteCandidate] = useState<{ id: string, name: string } | null>(null);

  const handleDelete = async () => {
    if (!deleteCandidate) return;
    const { id, name } = deleteCandidate;
    setFormLoad(true);

    // Deep Eradication: Find all sales tied to this product
    const { data: itemData } = await supabase.from('sale_items').select('sale_id').eq('product_id', id);
    const saleIds = Array.from(new Set(itemData?.map(item => item.sale_id) || []));
    
    // Delete the sales (which cascades and deletes the sale_items automatically)
    if (saleIds.length > 0) {
      await supabase.from('sales').delete().in('id', saleIds);
    }

    // Eradicate all history records mentioning this product
    await supabase.from('activity_logs').delete().like('description', `%${name}%`);

    // Finally delete the product itself
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) {
      logActivity('DELETE_PRODUCT', `Erased product and all associated sales/records: ${name}`);
      setProducts(prev => prev.filter(p => p.id !== id));
    }
    
    setFormLoad(false);
    setDeleteCandidate(null);
  };

  const openDeleteModal = (id: string, name: string) => {
    setDeleteCandidate({ id, name });
  };

  const openModal = (product?: Product) => {
    if (product) {
      setEditingId(product.id);
      setFormData({
        name: product.name,
        category: product.category,
        cost_price: product.cost_price,
        selling_price: product.selling_price,
        stock: product.stock,
        unit: product.unit || '',
      });
    } else {
      setEditingId(null);
      setFormData({ name: '', category: '', cost_price: 0, selling_price: 0, stock: 0, unit: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory ? p.category === filterCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Inventory Setup</h1>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="w-full sm:w-48 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-indigo-500 transition-all outline-none"
        >
          <option value="">All Categories</option>
          {categories.map(c => (
             <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex-1 overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm text-gray-600">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-medium">
              <tr>
                <th className="px-6 py-4 rounded-tl-xl text-xs uppercase tracking-wider">Product Name</th>
                <th className="px-6 py-4 text-xs uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs uppercase tracking-wider">Stock</th>
                <th className="px-6 py-4 text-xs uppercase tracking-wider">Cost</th>
                <th className="px-6 py-4 text-xs uppercase tracking-wider">Selling</th>
                <th className="px-6 py-4 rounded-tr-xl text-xs uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">Loading products...</td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">No products found.</td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-medium ${product.stock <= 5 ? 'text-red-600' : 'text-gray-900'}`}>
                        {product.stock} {product.unit}
                      </span>
                    </td>
                    <td className="px-6 py-4">{formatCurrency(product.cost_price)}</td>
                    <td className="px-6 py-4 text-emerald-600 font-medium">{formatCurrency(product.selling_price)}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => openModal(product)} className="text-gray-400 hover:text-indigo-600 transition-colors mx-2 p-1">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => openDeleteModal(product.id, product.name)} className="text-gray-400 hover:text-red-600 transition-colors ml-2 p-1">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden p-6 text-center"
          >
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <Trash2 className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Product</h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete <span className="font-bold">{deleteCandidate.name}</span>? This action cannot be undone and will permanently remove it from your inventory.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setDeleteCandidate(null)}
                disabled={formLoad}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 w-full"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={formLoad}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 w-full flex justify-center items-center"
              >
                {formLoad ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Product Edit/Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-lg font-bold text-gray-900">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">&times;</button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input required type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cost Price (PKR)</label>
                  <input required type="text" inputMode="decimal" value={formData.cost_price === 0 ? '' : formData.cost_price} onChange={e => {
                    const parsed = parseFloat(e.target.value);
                    setFormData({...formData, cost_price: isNaN(parsed) ? 0 : parsed})
                  }} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price (PKR)</label>
                  <input required type="text" inputMode="decimal" value={formData.selling_price === 0 ? '' : formData.selling_price} onChange={e => {
                    const parsed = parseFloat(e.target.value);
                    setFormData({...formData, selling_price: isNaN(parsed) ? 0 : parsed})
                  }} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Available Quantity</label>
                  <input required type="text" inputMode="numeric" pattern="[0-9]*" value={formData.stock === 0 ? '' : formData.stock} onChange={e => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    setFormData({...formData, stock: val ? parseInt(val) : 0})
                  }} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                  <select 
                    value={formData.unit} 
                    onChange={e => setFormData({...formData, unit: e.target.value})} 
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                  >
                    <option value="">Select Unit</option>
                    {storeType === 'general' && (
                      <>
                        <option value="pcs">Pieces (pcs)</option>
                        <option value="kg">Kilograms (kg)</option>
                        <option value="g">Grams (g)</option>
                        <option value="boxes">Boxes</option>
                        <option value="packs">Packs</option>
                        <option value="liters">Liters</option>
                      </>
                    )}
                    {storeType === 'medical' && (
                      <>
                        <option value="strips">Strips</option>
                        <option value="tablets">Tablets</option>
                        <option value="bottles">Bottles</option>
                        <option value="syrups">Syrups</option>
                        <option value="injections">Injections</option>
                        <option value="tubes">Tubes</option>
                      </>
                    )}
                    {storeType === 'other' && (
                      <>
                        <option value="items">Items</option>
                        <option value="units">Units</option>
                        <option value="lbs">Pounds (lbs)</option>
                        <option value="meters">Meters</option>
                        <option value="yards">Yards</option>
                        <option value="tons">Tons</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 flex-wrap">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none">
                  Cancel
                </button>
                <button type="submit" disabled={formLoad} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 focus:outline-none disabled:opacity-50">
                  {formLoad ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
