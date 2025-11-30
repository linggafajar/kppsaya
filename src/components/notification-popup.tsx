'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, AlertCircle, X } from 'lucide-react';

type NotificationType = 'success' | 'error' | 'warning';

interface NotificationPopupProps {
  isOpen: boolean;
  type: NotificationType;
  title: string;
  message: string;
  onClose: () => void;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

export function NotificationPopup({
  isOpen,
  type,
  title,
  message,
  onClose,
  autoClose = true,
  autoCloseDelay = 3000,
}: NotificationPopupProps) {
  const [isClosing, setIsClosing] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (isOpen && autoClose) {
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev - (100 / (autoCloseDelay / 50));
          return newProgress <= 0 ? 0 : newProgress;
        });
      }, 50);

      const timer = setTimeout(() => {
        handleClose();
      }, autoCloseDelay);

      return () => {
        clearTimeout(timer);
        clearInterval(progressInterval);
      };
    }
  }, [isOpen, autoClose, autoCloseDelay]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setProgress(100);
      onClose();
    }, 300);
  };

  if (!isOpen) return null;

  const config = {
    success: {
      icon: CheckCircle2,
      iconColor: 'text-green-500',
      bgGradient: 'from-green-50 via-white to-green-50',
      borderColor: 'border-green-200',
      progressColor: 'bg-green-500',
      glowColor: 'bg-green-400/20',
    },
    error: {
      icon: XCircle,
      iconColor: 'text-red-500',
      bgGradient: 'from-red-50 via-white to-red-50',
      borderColor: 'border-red-200',
      progressColor: 'bg-red-500',
      glowColor: 'bg-red-400/20',
    },
    warning: {
      icon: AlertCircle,
      iconColor: 'text-yellow-500',
      bgGradient: 'from-yellow-50 via-white to-yellow-50',
      borderColor: 'border-yellow-200',
      progressColor: 'bg-yellow-500',
      glowColor: 'bg-yellow-400/20',
    },
  };

  const currentConfig = config[type];
  const Icon = currentConfig.icon;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
      isClosing ? 'opacity-0' : 'opacity-100'
    }`}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Notification Card */}
      <div className={`relative bg-gradient-to-br ${currentConfig.bgGradient} rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden border-2 ${currentConfig.borderColor} transform transition-all duration-300 ${
        isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100 animate-bounce-in'
      }`}>
        
        {/* Decorative glow effect */}
        <div className={`absolute top-0 right-0 w-32 h-32 ${currentConfig.glowColor} rounded-full blur-3xl`} />
        <div className={`absolute bottom-0 left-0 w-32 h-32 ${currentConfig.glowColor} rounded-full blur-3xl`} />
        
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-white/80 hover:bg-white shadow-md transition-all duration-200 hover:scale-110 group"
          aria-label="Close"
        >
          <X className="w-4 h-4 text-gray-600 group-hover:text-gray-800 transition-colors" />
        </button>

        {/* Content */}
        <div className="relative p-6">
          {/* Icon with animation */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className={`absolute inset-0 ${currentConfig.glowColor} rounded-full blur-xl animate-pulse`} />
              <div className={`relative bg-white rounded-full p-3 shadow-lg animate-scale-in`}>
                <Icon className={`w-10 h-10 ${currentConfig.iconColor}`} />
              </div>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold text-center mb-2 text-gray-800">
            {title}
          </h3>
          
          {/* Message */}
          <p className="text-center text-gray-600 mb-4 text-sm">
            {message}
          </p>

          {/* Progress bar */}
          {autoClose && (
            <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full ${currentConfig.progressColor} transition-all duration-50 ease-linear`}
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          {/* Action button */}
          <button
            onClick={handleClose}
            className={`w-full mt-4 py-3 px-4 rounded-xl font-semibold text-white transition-all duration-200 transform hover:scale-105 shadow-lg ${
              type === 'success' 
                ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700' 
                : type === 'error'
                ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
                : 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700'
            }`}
          >
            {type === 'success' ? 'OK, Mengerti' : type === 'error' ? 'Coba Lagi' : 'OK'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Hook untuk menggunakan notification
export function useNotification() {
  const [notification, setNotification] = useState<{
    isOpen: boolean;
    type: NotificationType;
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: 'success',
    title: '',
    message: '',
  });

  const showNotification = (
    type: NotificationType,
    title: string,
    message: string
  ) => {
    setNotification({
      isOpen: true,
      type,
      title,
      message,
    });
  };

  const closeNotification = () => {
    setNotification((prev) => ({
      ...prev,
      isOpen: false,
    }));
  };

  return {
    notification,
    showNotification,
    closeNotification,
  };
}
