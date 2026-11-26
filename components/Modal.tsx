"use client";

import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";

type ModalProps = {
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
};

export function Modal({ title, onClose, children, footer }: ModalProps) {
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
        className="flex max-h-[85vh] w-full max-w-2xl flex-col border border-black bg-white shadow-[8px_8px_0_0_#000]"
      >
        <div className="flex items-center justify-between gap-4 border-b border-black px-5 py-4">
          <h2 className="text-[13px] font-bold uppercase tracking-[0.06em]">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            autoFocus
            className="inline-flex h-7 w-7 items-center justify-center border border-black transition-colors hover:bg-black hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
          >
            <X size={14} />
          </button>
        </div>
        <div className="overflow-y-auto">{children}</div>
        {footer ? (
          <div className="border-t border-black px-5 py-4">{footer}</div>
        ) : null}
      </div>
    </div>
  );
}
