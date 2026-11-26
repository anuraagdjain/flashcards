"use client";

import { Modal } from "@/components/Modal";

type ConfirmDialogProps = {
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({ onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <Modal
      title="Reset progress"
      onClose={onCancel}
      footer={
        <div className="flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="border border-black px-4 py-2 text-sm font-medium transition-colors hover:bg-black hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="border border-black bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
          >
            Reset progress
          </button>
        </div>
      }
    >
      <div className="px-5 py-6">
        <p className="text-sm text-[#6b6b6b]">
          This clears every known and learning mark, plus your current session.
          Your words in{" "}
          <code className="border border-black bg-[#f4f4f4] px-1 py-0.5 text-[13px] text-black">
            words.json
          </code>{" "}
          are not touched.
        </p>
      </div>
    </Modal>
  );
}
