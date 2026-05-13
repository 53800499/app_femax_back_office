"use client";

import { useEffect } from "react";
import { CheckCircle, XCircle, Info, AlertTriangle, X } from "lucide-react";

type AlertType = "success" | "error" | "info" | "warning";

interface AlertMessageProps {
  type?: AlertType;
  message: string;
  isOpen: boolean;
  onClose: () => void;
  autoClose?: boolean;
  duration?: number;
}

export default function AlertMessage({
  type = "success",
  message,
  isOpen,
  onClose,
  autoClose = true,
  duration = 5000,
}: AlertMessageProps) {
  useEffect(() => {
    if (!autoClose || !isOpen) return;

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [isOpen, autoClose, duration, onClose]);

  if (!isOpen) return null;

  const styles = {
    success: {
      bg: "bg-emerald-50 dark:bg-emerald-900/30",
      border: "border-emerald-500",
      text: "text-emerald-700 dark:text-emerald-400",
      icon: <CheckCircle size={20} />,
    },
    error: {
      bg: "bg-red-50 dark:bg-red-900/30",
      border: "border-red-500",
      text: "text-red-700 dark:text-red-400",
      icon: <XCircle size={20} />,
    },
    info: {
      bg: "bg-blue-50 dark:bg-blue-900/30",
      border: "border-blue-500",
      text: "text-blue-700 dark:text-blue-400",
      icon: <Info size={20} />,
    },
    warning: {
      bg: "bg-amber-50 dark:bg-amber-900/30",
      border: "border-amber-500",
      text: "text-amber-700 dark:text-amber-400",
      icon: <AlertTriangle size={20} />,
    },
  };

  const current = styles[type];

  return (
    <div
      className={`fixed top-6 right-6 z-999999 w-[350px] animate-slideIn rounded-2xl border-l-4 shadow-xl backdrop-blur-lg transition-all duration-300 ${current.bg} ${current.border}`}
    >
      <div className="flex items-start gap-3 p-4">
        <div className={`mt-1 ${current.text}`}>{current.icon}</div>

        <div className="flex-1">
          <p className={`text-sm font-medium ${current.text}`}>
            {message}
          </p>
        </div>

        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}