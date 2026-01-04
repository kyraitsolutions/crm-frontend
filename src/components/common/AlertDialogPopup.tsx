"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAlertStore } from "@/stores/alert.store";
import { AlertTriangle, CheckCircle, XCircle, Info } from "lucide-react";

const iconMap = {
  warning: AlertTriangle,
  success: CheckCircle,
  error: XCircle,
  info: Info,
} as const;

export const AlertDialog: React.FC = () => {
  const {
    isOpen,
    title,
    message,
    confirmText,
    cancelText,
    type,
    autoClose,
    onConfirm,
    onCancel,
    closeAlert,
  } = useAlertStore();

  const [animate, setAnimate] = useState(false);
  const Icon = iconMap[type ?? "info"];

  // Trigger animation when open changes
  useEffect(() => {
    if (isOpen) {
      setAnimate(true);
    } else {
      // Delay unmount for animation out
      const timeout = setTimeout(() => setAnimate(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  // Disable background scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Auto close if enabled
  useEffect(() => {
    if (isOpen && autoClose) {
      const timer = setTimeout(closeAlert, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, closeAlert]);

  // if (!isOpen && !animate) return null; // Keep mounted during exit animation

  const textColorClass = {
    success: "text-green-600",
    warning: "text-yellow-600",
    error: "text-red-600",
    info: "text-blue-600",
  }[type ?? "info"];

  return (
    <div
      className={`fixed top-0 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ease-in-out ${isOpen && animate ? "translate-y-0" : "-translate-y-full"
        }
        ${textColorClass}`}
    >
      <div
        className={`bg-white rounded-md shadow-xl w-[350px] md:max-w-md md:w-full p-4 md:p-6 text-center border
     `}
      >
        <div className={`flex justify-center mb-3  `}>
          <Icon className="w-10 h-10" />
        </div>
        <h2 className={`text-xl font-semibold mb-2 `}>{title}</h2>
        <p className="text-gray-600 mb-6">{message}</p>

        <div className="grid grid-cols-2 max-w-50 mx-auto justify-center gap-4">
          <Button
            variant="destructive"
            onClick={() => {
              onConfirm?.();
              closeAlert();
            }}
            className="rounded-md shadow-2xl"
          >
            {confirmText}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              onCancel?.();
              closeAlert();
            }}
            className="rounded-md shadow-2xl"
          >
            {cancelText}
          </Button>
        </div>
      </div>
    </div>
  );
};
