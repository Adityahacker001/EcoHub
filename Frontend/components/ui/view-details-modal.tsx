'use client';

import React from 'react';
import { X } from 'lucide-react';

export type ViewField = {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
};

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  fields: ViewField[];
  maxWidthClass?: string; // e.g. 'max-w-xl' or 'max-w-2xl'
};

export default function ViewDetailsModal({ open, onClose, title = 'Details', fields, maxWidthClass = 'max-w-2xl' }: Props) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      {/* Card */}
      <div className={`relative w-full ${maxWidthClass} mx-auto`}>
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-start justify-between p-4 sm:p-5 border-b">
            <div className="flex items-center gap-3">
              <h3 className="text-lg sm:text-xl font-semibold text-slate-900">{title}</h3>
            </div>
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="ml-2 inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {fields.map((f, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  {f.icon ? (
                    <div className="flex-shrink-0 mt-1 text-slate-600">{f.icon}</div>
                  ) : (
                    <div className="w-0.5" />
                  )}
                  <div className="w-full">
                    <div className="text-xs text-slate-500">{f.label}</div>
                    <div className="mt-1 text-sm text-slate-800">{f.value ?? '—'}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-4 sm:p-5 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 rounded-lg bg-slate-100 text-slate-800 hover:bg-slate-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
