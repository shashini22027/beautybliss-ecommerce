import React, { useEffect } from 'react';

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-5 right-5 px-5 py-3.5 rounded-xl shadow-lg border text-sm flex items-center gap-3 z-50 ${type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
      <span className="h-2 w-2 rounded-full bg-current"></span>
      <span>{message}</span>
    </div>
  );
};

export default Toast;
