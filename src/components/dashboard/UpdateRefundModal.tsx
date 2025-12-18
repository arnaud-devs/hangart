import React from "react";

interface UpdateRefundModalProps {
  open: boolean;
  onClose: () => void;
  refund: any; // Replace with RefundRequestDTO if available
  status: string;
  setStatus: (s: string) => void;
  adminResponse: string;
  setAdminResponse: (s: string) => void;
  submitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
  statusOptions: { value: string; label: string }[];
}

const UpdateRefundModal: React.FC<UpdateRefundModalProps> = ({
  open,
  onClose,
  refund,
  status,
  setStatus,
  adminResponse,
  setAdminResponse,
  submitting,
  onSubmit,
  statusOptions,
}) => {
  if (!open || !refund) return null;
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-black rounded-lg shadow-lg p-8 w-full max-w-md relative border border-gray-200 dark:border-white/10">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Update Refund Request</h2>
        <div className="mb-2 font-semibold text-gray-900 dark:text-white">Order #{refund.order?.order_number || refund.order_details?.order_number}</div>
        <div className="mb-4 text-gray-700 dark:text-gray-300">{refund.description}</div>
        <form onSubmit={onSubmit}>
          <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">Status *</label>
          <select
            className="w-full border border-gray-300 dark:border-white/10 rounded px-3 py-2 mb-4 bg-white dark:bg-black text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-600 focus:border-transparent outline-none"
            value={status}
            onChange={e => setStatus(e.target.value)}
            required
          >
            <option value="">Select status</option>
            {statusOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">Admin Response *</label>
          <textarea
            className="w-full border border-gray-300 dark:border-white/10 rounded px-3 py-2 mb-4 bg-white dark:bg-black text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-600 focus:border-transparent outline-none"
            value={adminResponse}
            onChange={e => setAdminResponse(e.target.value)}
            rows={3}
            required
          />
          <button
            type="submit"
            className="w-full py-3 bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:bg-yellow-300 disabled:cursor-not-allowed transition-colors"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit Update"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateRefundModal;
