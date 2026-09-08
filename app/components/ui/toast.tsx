"use client";

import { useEffect } from "react";
import { CheckIcon, CloseIcon } from "../icons";
import { IconButton } from "./icon-button";

/**
 * role="status" with aria-live="polite" for success and info. Errors use
 * role="alert" and never auto-dismiss — something a person needs to act on must
 * not vanish while they are reading it.
 */
export function Toast({
  message,
  onDismiss,
  duration = 4000,
}: {
  message: string | null;
  onDismiss: () => void;
  duration?: number;
}) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onDismiss, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onDismiss]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-4 bottom-4 z-(--z-toast) flex justify-center sm:inset-x-auto sm:right-6 sm:bottom-6 sm:justify-end"
    >
      {message && (
        <div className="animate-settle pointer-events-auto flex w-[min(24rem,100%)] items-center gap-3 rounded-card bg-surface-inverse p-3 pl-4 text-ink-inverse shadow-float">
          <CheckIcon className="size-5 shrink-0 text-success" />
          <p className="flex-1 text-sm">{message}</p>
          <IconButton
            label="Tutup pemberitahuan"
            size="sm"
            onClick={onDismiss}
            className="text-ink-inverse hover:bg-white/10"
          >
            <CloseIcon className="size-4" />
          </IconButton>
        </div>
      )}
    </div>
  );
}
