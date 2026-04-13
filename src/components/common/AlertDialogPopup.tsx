"use client";

import { Button } from "@/components/ui/button";
import { useAlertStore } from "@/stores/alert.store";
import { AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react";
import React, { useEffect } from "react";

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

  const Icon = iconMap[type ?? "info"];

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

  // const textColorClass = {
  //   success: "text-green-600",
  //   warning: "text-yellow-600",
  //   error: "text-red-600",
  //   info: "text-blue-600",
  // }[type ?? "info"];

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs"
        onClick={closeAlert}
      />

      {/* Modal */}
      <div
        className={`relative rounded-md bg-white rounded-xl shadow-2xl w-[90%] max-w-md p-6 transform transition-all duration-300 ${
          isOpen ? "scale-100 opacity-100" : "scale-90 opacity-0"
        }`}
      >
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="p-3 rounded-full bg-red-100">
            <Icon className="w-6 h-6 text-red-600" />
          </div>
        </div>

        <h2 className="text-xl font-semibold text-center mb-2">{title}</h2>

        <p className="text-gray-500 text-center mb-6">{message}</p>

        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            className="px-6 border border-primary/40 rounded-xl"
            onClick={() => {
              onCancel?.();
              closeAlert();
            }}
          >
            {cancelText}
          </Button>

          <Button
            variant="destructive"
            className="px-6 rounded-xl"
            onClick={() => {
              onConfirm?.();
              closeAlert();
            }}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
    // <div
    //   className={`fixed inset-0 flex justify-center z-50 transition-all duration-300 ease-in-out ${
    //     isOpen && animate ? "translate-y-0" : "-translate-y-full"
    //   }
    //     ${textColorClass}`}
    // >
    //   <div className="bg-black w-full h-full">
    //     <div
    //       className={`h-fit bg-white rounded-md shadow-xl w-[350px] md:max-w-md md:w-full p-4 md:p-6 text-center border
    //  `}
    //     >
    //       <div className={`flex justify-center mb-3  `}>
    //         <Icon className="w-10 h-10" />
    //       </div>
    //       <h2 className={`text-xl font-semibold mb-2 `}>{title}</h2>
    //       <p className="text-gray-600 mb-6">{message}</p>

    //       <div className="flex justify-end items-center gap-4">
    //         <Button
    //           variant="destructive"
    //           onClick={() => {
    //             onConfirm?.();
    //             closeAlert();
    //           }}
    //           className="rounded-md shadow-2xl"
    //         >
    //           {confirmText}
    //         </Button>
    //         <Button
    //           variant="outline"
    //           onClick={() => {
    //             onCancel?.();
    //             closeAlert();
    //           }}
    //           className="rounded-md shadow-2xl"
    //         >
    //           {cancelText}
    //         </Button>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
};
