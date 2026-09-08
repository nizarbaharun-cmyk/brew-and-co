"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/app/lib/cn";
import { IconButton } from "./icon-button";
import { CloseIcon } from "../icons";

/**
 * Built on the native <dialog>. showModal() gives focus trapping, Escape, the
 * ::backdrop, and inertness for the rest of the page — reimplementing those with
 * effects and keydown listeners is how they end up subtly wrong.
 *
 * Two things <dialog> does not do, handled here: locking background scroll, and
 * keeping the close animation (it does not have one — close() is immediate).
 */
export function Sheet({
  open,
  onClose,
  title,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onCancel={onClose}
      aria-label={title}
      className={cn(
        "bg-surface text-ink shadow-overlay backdrop:bg-scrim",
        "m-0 ml-auto h-dvh w-[min(26rem,100vw)] max-w-none rounded-l-card",
        "max-sm:mt-auto max-sm:ml-0 max-sm:h-auto max-sm:max-h-[85dvh] max-sm:w-full",
        "max-sm:rounded-l-none max-sm:rounded-t-card",
      )}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between gap-4 border-b border-border p-4">
          <h2 className="font-display text-xl font-semibold type-display-small">{title}</h2>
          <IconButton label="Tutup" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </div>

        <div className="flex-1 overflow-y-auto p-4">{children}</div>

        {footer && <div className="border-t border-border bg-surface p-4">{footer}</div>}
      </div>
    </dialog>
  );
}
