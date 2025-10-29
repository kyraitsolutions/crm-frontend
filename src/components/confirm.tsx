import React, { useEffect, useRef } from "react";

type ConfirmModalProps = {
  isOpen: boolean;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  // Optional classNames for customization
  className?: string;
};

// A11y-friendly focus trap (lightweight)
function useFocusTrap(
  active: boolean,
  containerRef: React.RefObject<HTMLElement>
) {
  useEffect(() => {
    if (!active) return;
    const container = containerRef.current;
    if (!container) return;

    const focusableSelectors = [
      "a[href]",
      "button:not([disabled])",
      "textarea:not([disabled])",
      "input:not([disabled])",
      "select:not([disabled])",
      "[tabindex]",
    ].join(",");

    const nodes = Array.from(
      container.querySelectorAll<HTMLElement>(focusableSelectors)
    ).filter(
      (n) =>
        !n.hasAttribute("disabled") && n.getAttribute("aria-hidden") !== "true"
    );

    const first = nodes[0];
    const last = nodes[nodes.length - 1];

    first?.focus();

    function handleKey(e: KeyboardEvent) {
      if (e.key === "Tab") {
        if (nodes.length === 0) {
          e.preventDefault();
          return;
        }
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last?.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first?.focus();
          }
        }
      }
    }

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [active, containerRef]);
}

export default function ConfirmModal({
  isOpen,
  title = "Confirm action",
  description = "Are you sure you want to continue? This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false,
  onConfirm,
  onCancel,
  className = "",
}: ConfirmModalProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useFocusTrap(isOpen, containerRef);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) onCancel();
    }

    if (isOpen) {
      previouslyFocused.current = document.activeElement as HTMLElement | null;
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", onKey);
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      previouslyFocused.current?.focus();
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  // Render modal: portal is optional — keep simple by rendering at root level.
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      aria-describedby="confirm-modal-desc"
      className="fixed inset-0 z-50"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 backdrop-blur-sm"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Modal panel */}
      <div
        ref={containerRef}
        className={
          "relative z-10 w-96 rounded-xl bg-white p-6 shadow-xl ring-1 ring-black/5" +
          className
        }
        onClick={(e) => e.stopPropagation()}
      >
        <header className="mb-2 flex items-start justify-between gap-4">
          <div>
            <h2
              id="confirm-modal-title"
              className="text-lg font-medium text-slate-900"
            >
              {title}
            </h2>
            {description && (
              <p
                id="confirm-modal-desc"
                className="mt-1 text-sm text-slate-500"
              >
                {description}
              </p>
            )}
          </div>
          <button
            aria-label="Close"
            onClick={onCancel}
            className="-mr-1 ml-auto inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
          >
            {/* Simple cross icon (no external libs) */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </header>

        <div className="mt-4 flex gap-3">
          <button
            onClick={onCancel}
            className="inline-flex items-center justify-center rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
          >
            {cancelText}
          </button>

          <button
            onClick={async () => {
              try {
                await onConfirm();
              } catch (err) {
                // If caller throws, we keep modal open — caller can close via onCancel
                // Consider reporting errors externally
                console.error(err);
              }
            }}
            disabled={loading}
            className="ml-auto inline-flex items-center justify-center rounded-md bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-700 disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
          >
            {loading ? (
              <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
            ) : null}
            {confirmText}
          </button>
        </div>

        {/* Optional footnote / small helper */}
        <div className="mt-3 text-xs text-slate-400">
          This action will be recorded in the activity log.
        </div>
      </div>
    </div>
  );
}
