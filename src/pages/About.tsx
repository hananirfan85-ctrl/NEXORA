import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, User, GraduationCap, Code } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="min-h-screen bg-[#030305] text-white selection:bg-indigo-500/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <Link to="/home" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-12">
          <ArrowLeft size={20} />
          <span className="font-mono text-sm tracking-widest uppercase">Back to Platform</span>
        </Link>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6">
            About NEXA POS
          </h1>
          <p className="text-xl md:text-2xl font-sans font-light text-gray-400 mb-12 leading-relaxed">
            NEXA POS is a next-generation Point of Sale (POS), CRM, and Inventory Management system designed for speed, simplicity, and extreme scalability. Built with a focus on immersive aesthetics and offline-first capabilities.
          </p>
          
          <div className="w-full h-px border-t border-white/10 mb-12" />

          <div className="mb-16">
            <h2 className="text-3xl font-display font-bold mb-8">The Visionaries Behind It</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Hanan Irfan */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl flex flex-col justify-between">
                <div>
                  <h3 className="text-3xl font-bold font-display text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-300 mb-4">Hanan Irfan</h3>
                  <p className="text-gray-300 font-light text-base mb-8">
                    Founder & Lead Architect at NEXA POS. Passionate about bringing world-class, enterprise-grade tools to businesses of all sizes through elegant code and intuitive design.
                  </p>
                  
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-center gap-4 text-gray-200">
                      <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                        <User size={18} className="text-indigo-400" />
                      </div>
                      <div className="font-mono text-sm uppercase tracking-widest">18 Years Old</div>
                    </li>
                    <li className="flex items-center gap-4 text-gray-200">
                      <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                        <GraduationCap size={18} className="text-indigo-400" />
                      </div>
                      <div>
                        <div className="font-mono text-sm uppercase tracking-widest">KFUEIT University</div>
                        <div className="text-xs text-gray-400 mt-1">4th Semester, BSCS</div>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="flex justify-center mt-auto">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-indigo-500/20 shadow-[0_0_30px_-10px_rgba(99,102,241,0.5)]">
  <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-800 flex items-center justify-center">
    <img
      src="https://pbs.twimg.com/profile_images/2022622427378020352/xOqGLbdb_400x400.jpg"
      alt="Hanan Irfan"
      className="w-full h-full object-cover"
    />
  </div>
</div>
                </div>
              </div>

              {/* Ahmad Ali */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl flex flex-col justify-between">
                <div>
                  <h3 className="text-3xl font-bold font-display text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-300 mb-4">Ahmad Ali</h3>
                  <p className="text-gray-300 font-light text-base mb-8">
                    Co-Founder & Core Developer. Specializing in robust system architecture and ensuring seamless functionality across our expansive feature sets.
                  </p>
                  
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-center gap-4 text-gray-200">
                      <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                        <User size={18} className="text-blue-400" />
                      </div>
                      <div className="font-mono text-sm uppercase tracking-widest">20 Years Old</div>
                    </li>
                    <li className="flex items-center gap-4 text-gray-200">
                      <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                        <GraduationCap size={18} className="text-blue-400" />
                      </div>
                      <div>
                        <div className="font-mono text-sm uppercase tracking-widest">KFUEIT University</div>
                        <div className="text-xs text-gray-400 mt-1">4th Semester, BSCS</div>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="flex justify-center mt-auto">
                   <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-blue-500/20 shadow-[0_0_30px_-10px_rgba(59,130,246,0.5)]">
                     <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-cyan-800 flex items-center justify-center">
<img
  src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAoHBwgHBgoICAgLCgoLDhgQDg0NDh0VFhEYIx8lJCIfIiEmKzcvJik0KSEiMEExNDk7Pj4+JS5ESUM8SDc9Pjv/2wBDAQoLCw4NDhwQEBw7KCIoOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozv/wAARCABgAGADASIAAhEBAxEB/8QAHAAAAgMBAQEBAAAAAAAAAAAABAUCAwYHAAEI/8QAPRAAAQIEAwUFBQYEBwAAAAAAAQIDAAQREgUhMQYTIkFxMlFhgZEUI0KxwQckM1Kh0VNygvAVFkNig6Lx/8QAGgEAAgMBAQAAAAAAAAAAAAAAAwQBAgUABv/EACQRAAICAQQBBQEBAAAAAAAAAAABAgMRBBIhMQUiMkFRYROx/9oADAMBAAIRAxEAPwDcjsxG/hNuedImOyYgSEU+GADi6JpTwxARNJrEQNesckVfJAmjcDvOWNqcdcS02nNalKCQB3kmCbappHGNvNsHcXxBzD5NdkjLrKapP4pGVx8O6LJZKt4R1BG0+ArTUYzJkA2/jD6wOxtngD7/ALO3ijBc62gnwJyMcQlZGbxApak5Z59fMIQVfKLMUwTEcGWhOISymC4m5NYthEPdjOD9BtzLUzctt4OU7RqCRUVzpz5x5bqLaUqTobvpHMfsuxpCX5jCnt4px/jaVmeyMx6R0xuncMvCKtYZyfBNCLU15xWTxRdWKO/rHZJaGAJPa5aRBaPeV5RNHaMeWqkVyER5CTnWPAa9Y83U8XKJpHEesdk7BStFzaknmCI4KjAGMN2jdkNoX/YWmqqusKyscrQNax+gLdY5Nt/sljE7tL7TJtLm2plXCoJya0yJ7u7wiU/shrrHZerb7BNmpJqU2ewdx1KkXb58hu7lWgqTpzpA85jyNssEfM9gcwlbIK2n5biSnlXOhpUZ6w5xXZvCsfwzDMClnVNTkgzYmZ3fAoDJaVZ11zhjs/sonZfD3m3JgzT7nP4U0rS0ctSYG5wS47Go1WuWJ9GK+zGQmGceM69LqDK5daW3FDJSqjSuvOOpkcPdcQaVpCzB5eS3DG47UqgIV/tNNOudTDBbtVEcotGe7kBbVGp4TCfhig9o9YmhdUxD4jFugLeRh8XlFdtVGvOLvi8ogT7y0coqFLEUGUTT2jAyplmWbvfdSjqdfKF7u08myo2IW50oBFdyGK9NbZ7UOFmkCrZXMJWhJtVabVdxpkYRTG1bi/wpS3+ck/KBv82Ykg+7Qyn/AIz+8Q5JrA1DxuoynwTlMGDbhQ+4lDXOrxQVHnwpoB6mPmL7Qy8t9xkPvMxklKEZhPU90Zp//EsYm5zE5nilmljebtVoTlrb9YdSOEhqXcnm0hLLSbiqtPKFWnnCH3DEvW+Rjh080mbdw/d2LSAq/KizTMdYYKTxRjFlanC/nWtxPcY3+F4cJzCJaYmXzLvOJrxUKVd2fiM4crz0Z/ktLGlKxPsDSpI7J1j6k6wRM4XMywK7d63/ABW8x+mkDNnWCNY7MhNMZ1qoQmxXGVsOKYl8zopevkILnJncSi3Br2R55Qv2ekEz+KKdcru2Mz3EmF5yecI2NHXCMHdYuEUSuz2KYr71xe6QrMKc1PlGjkdj8PlbVu3PODmrT0h4kBOQ8omk16QLIC7X3WcJ4X4DIwyWpY0w2n82QyjLbavJlGW5JpoI3qs1VrUD5Z0jROYktl1e7aqm+1LmgNBoYwO1M+mdxhe7PAyN2kchQ50/eHVUoxyyfFb79Tz0grZCXSXZsrQChy1JSoVSTny0i3GCwxLLkkOWS128XuxmR8I/vuET2Ua3cpOPvixDJC11y4Qk+nOEczizrs2+80AEOruSlYrwjIA+VI5QUeTTVc79ZNrqJVuWnXm2WFqq4sJUlXKp7xHRsRC2Uol2wCzukW256ZfX5Rjdm2facdEzMD3bNFLtApXkKfrGrNm8XwhBKdKZDPXrF6l3JGd5q1SsjVno9MO7mWTLtfCQVEHtLP0EALFr6hSlc+7rBylrNnMIqUJpQA6Vy5+MLZt21+8qrQCp/QmOsk2smTVDnb8sExVdGWkV7S6+n/sMsBm5bD8M3z7oRvXD/f1hLix9/LDwV840WBNSq8PYd3VXAml5TU6nn6+sJT9zN2SUdFFfYQvGHlk+zYfMOkXDQIFyailT3ka+IOhixqbxN5/dtySWxcbVuO5UyIyGeYKuhTBlFfCj1i6XWht/jUkVT0pTWIgsyRlzcUuhVtGpqQwl2fbNpKRRvKlxyGXfn+kc4l6ldyQVrCbhzqrvjUbcqWh1qVByzc/prQfM+kZMFaFWhZTXWlevKHZ9o9D4enbp3L5f+BCZ11hiYla3JeUkuZ60qaep/SBkJUpQQEVJ0HNR5R8ITDPAW9/iyVnMMoK1dwJyA+fpA5y+DTscKK5TNThEkiQlEs1BVqtRyqecFKSpc2LKKCu0fCIIUyFW8VvSL0qRLJKqXXd2VBSC154SPC6ianJ2TPi1gKI0JHDSEmNrDTL9f4Vo6nSHCFb6q1a6DpGZ2pdtmUMfnUSf6QP3ibvTHaE8dB3aiJ9xc1dllfzfSG8pi7WEYVhjS0KefnXd022kip1JOfIAQnxOq1tqWakOGp6iIoklz0uHG5Nxybk6+yzKTQNEnMa8+eWkJyS38mzt/po4L9Hj22LSXSyhtClg0tSVuH/okgHwrDZqYE/KNPhDxesr7u5NPIivkaRGRQqUlGmXFqcWlPEvUk84Y76Xk5JcwuoJTnQmp1pTxglGNxkaiPUYI5rtG6t3HFoX/pJSjplU/OFauzcOzWkF4lMuzk65OPJoXqlIJzoDSh8aQIa215QSb5ye00sNlMI/SIuLCE3nU8o1Oy0mWMP35R719W9VXu0A9PnGYkZU4hPobt4Emq+ldPON/Kyy7R7wivw6eXSAwW5mV5jUbYqpBKV1VwpFRqIrUtbqlpKEih/bSCXmZqUbSVOMqGidM/DxiJa39zsxTe66CnIZCHa4SXKPI2WRawylItVqPDuMZnatv7207T8w+X7RpQUNKNrIUeVq6U8s6iM/tEtcxKXqQBu1V+h+YgN5qeIlt1EWz//Z"
  alt="Profile"
  className="w-full h-full object-cover"
/>                     </div>
                   </div>
                </div>
              </div>
              
              {/* Danish Ali */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl flex flex-col justify-between">
                <div>
                  <h3 className="text-3xl font-bold font-display text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-green-300 mb-4">Danish Ali</h3>
                  <p className="text-gray-300 font-light text-base mb-8">
                    Co-Founder. Brings innovative ideas to our operations, ensuring that the software perfectly aligns with our users' real-world needs.
                  </p>
                  
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-center gap-4 text-gray-200">
                      <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center border border-teal-500/30">
                        <User size={18} className="text-teal-400" />
                      </div>
                      <div className="font-mono text-sm uppercase tracking-widest">20 Years Old</div>
                    </li>
                    <li className="flex items-center gap-4 text-gray-200">
                      <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center border border-teal-500/30">
                        <GraduationCap size={18} className="text-teal-400" />
                      </div>
                      <div>
                        <div className="font-mono text-sm uppercase tracking-widest">KFUEIT University</div>
                        <div className="text-xs text-gray-400 mt-1">4th Semester, BSCS</div>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="flex justify-center mt-auto">
                   <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-teal-500/20 shadow-[0_0_30px_-10px_rgba(45,212,191,0.5)]">
                     <div className="absolute inset-0 bg-gradient-to-br from-teal-600 to-emerald-800 flex items-center justify-center">
                        <span className="text-4xl font-display font-bold text-white/50">DA</span>
                     </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-3xl font-display font-bold mb-6">Software Awareness & Philosophy</h2>
            <p className="text-gray-400 font-light mb-8 max-w-3xl leading-relaxed">
              Our main focus is to change how modern businesses operate by delivering advanced tools previously reserved for massive corporations, packaged into an intuitive interface that anybody can learn in minutes.
            </p>
            <div className="grid md:grid-cols-2 gap-8 font-light text-gray-300">
              <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                <h4 className="text-white font-bold mb-3 tracking-wide">Design First</h4>
                <p>Ugly software slows people down. NEXA POS prioritizes a polished, high-contrast, dark-mode-first aesthetic that reduces eye strain and increases focus during high-volume retail hours.</p>
              </div>
              <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                <h4 className="text-white font-bold mb-3 tracking-wide">Anywhere, Offline & Online</h4>
                <p>NEXA POS works seamlessly through cutting-edge Electron integration on Desktop, enabling extreme performance. Keep selling offline, and sync to the cloud instantly when back online.</p>
              </div>
              <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                <h4 className="text-white font-bold mb-3 tracking-wide">Enterprise Feature Set</h4>
                <p>Complete with an AI Chatbot, CRM Admin Panel, automated analytics, offline caching mechanisms, and secure Supabase backend to keep your inventory matrix perfectly balanced at all times.</p>
              </div>
              <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                <h4 className="text-white font-bold mb-3 tracking-wide">Install Anywhere</h4>
                <p>Install via your browser to launch it right from your dock or home screen, offering an instantaneous, app-like experience backed by Service Workers.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
