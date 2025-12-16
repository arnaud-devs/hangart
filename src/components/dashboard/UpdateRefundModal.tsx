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
    <div className="fixed inset-0 bg-gray-700/70 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4">Update Refund Request</h2>
        <div className="mb-2 font-semibold">Order #{refund.order?.order_number || refund.order_details?.order_number}</div>
        <div className="mb-2 text-gray-700">{refund.description}</div>
        <form onSubmit={onSubmit}>
          <label className="block mb-2 font-medium">Status *</label>
          <select
            className="w-full border rounded px-3 py-2 mb-4"
            value={status}
            onChange={e => setStatus(e.target.value)}
            required
          >
            <option value="">Select status</option>
            {statusOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <label className="block mb-2 font-medium">Admin Response *</label>
          <textarea
            className="w-full border rounded px-3 py-2 mb-4"
            value={adminResponse}
            onChange={e => setAdminResponse(e.target.value)}
            rows={3}
            required
          />
          <button
            type="submit"
            className="w-full py-3 bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:bg-yellow-300"
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
