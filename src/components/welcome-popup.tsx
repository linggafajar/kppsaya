'use client';

import { useEffect, useState } from 'react';
import { X, Sparkles, CheckCircle2 } from 'lucide-react';

export function WelcomePopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Check if popup was already shown in this session
    const hasSeenPopup = sessionStorage.getItem('hasSeenWelcomePopup');
    
    if (!hasSeenPopup) {
      // Show popup after a short delay
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      sessionStorage.setItem('hasSeenWelcomePopup', 'true');
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
      isClosing ? 'opacity-0' : 'opacity-100'
    }`}>
      {/* Backdrop with blur effect */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Popup Card */}
      <div className={`relative bg-gradient-to-br from-blue-50 via-white to-blue-50 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all duration-300 ${
        isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
      }`}>
        
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-blue-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-400/10 rounded-full blur-3xl" />
        
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white shadow-lg transition-all duration-200 hover:scale-110 group"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-gray-600 group-hover:text-gray-800 transition-colors" />
        </button>

        {/* Content */}
        <div className="relative p-8">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl animate-pulse" />
              <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 rounded-full p-4 shadow-xl">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-center mb-3 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Selamat Datang!
          </h2>
          
          {/* Subtitle */}
          <p className="text-center text-gray-600 mb-6 text-lg">
            Sistem Manajemen Sarana Prasarana
          </p>

          {/* School name */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl p-4 mb-6 shadow-lg">
            <p className="text-center font-semibold text-xl">
              SMA N 1 MOJOTENGAH
            </p>
          </div>

          {/* Features list */}
          <div className="space-y-3 mb-6">
            {[
              'Kelola Barang dengan Mudah',
              'Peminjaman & Permintaan Efisien',
              'Notifikasi Real-time'
            ].map((feature, index) => (
              <div 
                key={index}
                className="flex items-center gap-3 p-3 bg-white/70 rounded-xl backdrop-blur-sm transform transition-all duration-200 hover:scale-105 hover:bg-white/90"
              >
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-700 font-medium">{feature}</span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <button
            onClick={handleClose}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-4 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105 hover:shadow-xl"
          >
            Mulai Sekarang
          </button>

          {/* Footer text */}
          <p className="text-center text-gray-500 text-sm mt-4">
            Sistem ini akan membantu Anda mengelola sarana prasarana dengan lebih efisien
          </p>
        </div>
      </div>
    </div>
  );
}
