"use client";
import React from "react";

interface ModalWrapperProps {
  children: React.ReactNode;
  onClose?: () => void;
  open: boolean;
}

export default function ModalWrapper({ children, onClose, open }: ModalWrapperProps) {
  React.useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 backdrop-blur-sm bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-3xl mx-4 transform transition-all duration-300 ease-out">
        <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
          {children}
        </div>
      </div>
      <style jsx>{`
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0);} }
        .animate-fade-in-up { animation: fade-in-up 220ms ease-out both; }
      `}</style>
    </div>
  );
}
