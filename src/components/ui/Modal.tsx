"use client";

import React from "react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
};

export default function Modal({ open, onClose, title, children, className }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className={`relative z-10 w-full max-w-2xl mx-4 ${className || ""}`}> 
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {title && (
            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
              <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</div>
            </div>
          )}
          <div className="p-4 text-gray-900 dark:text-gray-100">{children}</div>
        </div>
      </div>
    </div>
  );
}
