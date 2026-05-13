"use client";

import { AlertTriangle, Trash2, X } from "lucide-react";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  title?: string;
  description?: string;
  loading?: boolean;
  error?: string | null;
  errorStatus: boolean;
}

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Supprimer cet élément ?",
  description = "Cette action est irréversible. Voulez-vous continuer ?",
    loading = false,
    error = null,
    errorStatus = false,
}: ConfirmDeleteModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md m-4">
      <div className="rounded-2xl bg-white p-6 dark:bg-gray-900">
        
        {/* Icon */}
        <div className="flex items-center justify-center w-14 h-14 mx-auto rounded-full bg-red-100 dark:bg-red-900/30">
          <AlertTriangle className="text-red-600 dark:text-red-400" size={26} />
        </div>

        {/* Content */}
              <div className="mt-5 text-center">
                  {error && errorStatus && (
          <div className="mb-4 rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            {title}
          </h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {description}
          </p>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-center gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          ><X className="w-4 h-4 mr-1"/>
            Annuler
          </Button>

          <Button
            onClick={onConfirm} variant="danger"
            className="bg-red-600 hover:bg-red-700 text-white"
            loading={loading}
          >{loading? "" : <Trash2 className="w-4 h-4 mr-1" />}
            Supprimer
          </Button>
        </div>
      </div>
    </Modal>
  );
}