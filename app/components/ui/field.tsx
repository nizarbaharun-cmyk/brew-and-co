import { useId } from "react";
import { cn } from "@/app/lib/cn";
import { AlertIcon } from "../icons";

const CONTROL =
  "w-full rounded-control border border-border-strong bg-surface px-3 text-base text-ink " +
  "placeholder:text-ink-muted transition-colors duration-(--duration-fast) ease-standard " +
  "aria-invalid:border-danger disabled:bg-surface-muted disabled:text-ink-disabled";

/**
 * Owns the label, helper text, and error wiring for every control, so the
 * accessibility plumbing is written once. Children is a render prop because the
 * generated id and aria attributes have to land on the control itself.
 */
export function Field({
  label,
  helper,
  error,
  required,
  labelHidden,
  id: idOverride,
  className,
  children,
}: {
  label: string;
  helper?: string;
  error?: string;
  required?: boolean;
  /** Only when an adjacent heading already names the field. Never to save space. */
  labelHidden?: boolean;
  /** Set only when the control needs a stable id — a fragment link target, say. */
  id?: string;
  className?: string;
  children: (props: {
    id: string;
    "aria-describedby": string | undefined;
    "aria-invalid": true | undefined;
  }) => React.ReactNode;
}) {
  const generatedId = useId();
  const id = idOverride ?? generatedId;
  const helperId = `${id}-helper`;
  const errorId = `${id}-error`;
  const describedBy = error ? errorId : helper ? helperId : undefined;

  return (
    <div className={cn("space-y-1.5", className)}>
      <label
        htmlFor={id}
        className={cn(
          "block text-sm font-medium text-ink",
          labelHidden && "sr-only",
        )}
      >
        {label}
        {required && (
          <span className="text-danger" aria-hidden="true">
            {" *"}
          </span>
        )}
      </label>

      {children({
        id,
        "aria-describedby": describedBy,
        "aria-invalid": error ? true : undefined,
      })}

      {error ? (
        <p id={errorId} className="flex items-start gap-1.5 text-sm text-danger-ink">
          <AlertIcon className="mt-0.5 size-4 shrink-0" />
          {error}
        </p>
      ) : helper ? (
        <p id={helperId} className="text-sm text-ink-muted">
          {helper}
        </p>
      ) : null}
    </div>
  );
}

export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return <input {...props} className={cn(CONTROL, "h-11", className)} />;
}

export function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return <textarea {...props} className={cn(CONTROL, "min-h-24 py-3", className)} />;
}
