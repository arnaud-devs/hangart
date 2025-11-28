"use client";

import React from "react";
import Modal from "@/components/ui/Modal";

type Props = {
  open: boolean;
  title?: string;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
};

export default function ConfirmDialog({ open, title, message, onConfirm, onCancel, confirmLabel = "Confirm", cancelLabel = "Cancel" }: Props) {
  return (
    <Modal open={open} onClose={onCancel} title={title}>
      <div className="space-y-4">
        {message && <p className="text-sm text-gray-700 dark:text-gray-300">{message}</p>}
        <div className="flex justify-end gap-2">
          <button onClick={onCancel} className="px-3 py-1 rounded border bg-white dark:bg-gray-700">{cancelLabel}</button>
          <button onClick={onConfirm} className="px-3 py-1 rounded bg-red-600 text-white">{confirmLabel}</button>
        </div>
      </div>
    </Modal>
  );
}
