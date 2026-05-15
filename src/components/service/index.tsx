"use client";

import React, {
  useCallback,
  useMemo,
  useState,
} from "react";

import {
  CirclePlus,
  Eye,
  SquarePen,
  Trash2,
} from "lucide-react";

import DataTable, {
  Column,
} from "../tables/DataTable";

import Pagination from "../tables/Pagination";

import ServiceForm, {
  ServiceFormData,
} from "./form";

import ConfirmDeleteModal from "../common/ConfirmDeleteModal";

import AlertMessage from "../common/AlertMessage";

import { auth } from "@/lib/firebase";


import { ServiceType } from "@/server/modules/service/service.types";
import { useServices } from "@/hooks/modules/useService";
import Button from "../ui/button/Button";

const initialForm: ServiceFormData = {
  id: 0,

  title: "",

  shortDescription: "",

  description: "",

  image: "",

  imageFile: undefined,

  features: [],
};

export const Service = () => {
  const [form, setForm] =
    useState<ServiceFormData>(
      initialForm
    );

  const [isOpen, setIsOpen] =
    useState(false);

  const [
    editingService,
    setEditingService,
  ] = useState<number | null>(
    null
  );

  const [deleteId, setDeleteId] =
    useState<number | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [isDeleting, setIsDeleting] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [message, setMessage] =
    useState("");

  const [successOpen, setSuccessOpen] =
    useState(false);

  const [
    errorOpenDelete,
    setErrorOpenDelete,
  ] = useState(false);

  const [currentPage, setCurrentPage] =
    useState(1);

  const {
    services: fetchedServices,

    createService,

    updateService,

    deleteService,
  } = useServices();

  const itemsPerPage = 5;

  /* ------------------------------ PAGINATION ----------------------------- */

  const totalPages = Math.ceil(
    fetchedServices.length /
      itemsPerPage
  );

  const paginatedServices =
    useMemo(() => {
      const start =
        (currentPage - 1) *
        itemsPerPage;

      return fetchedServices.slice(
        start,
        start + itemsPerPage
      );
    }, [
      fetchedServices,
      currentPage,
    ]);

  /* ------------------------------ FORM UTILS ----------------------------- */

  const resetForm = useCallback(() => {
    setForm(initialForm);

    setEditingService(null);

    setError(null);
  }, []);

  const closeModal = useCallback(() => {
    resetForm();

    setIsOpen(false);
  }, [resetForm]);

  const openCreateModal =
    useCallback(() => {
      resetForm();

      setIsOpen(true);
    }, [resetForm]);

  /* ------------------------------ EDIT SERVICE ----------------------------- */

  const handleEdit = useCallback(
    (service: ServiceType) => {
      try {
        if (!service) {
          throw new Error(
            "Service introuvable."
          );
        }

        setEditingService(
          service.id
        );

        setForm({
          id: service.id,

          title: service.title,

          shortDescription:
            service.shortDescription,

          description:
            service.description,

          image:
            service.image || "",

          imageFile: undefined,

          features:
            service.features || [],
        });

        setIsOpen(true);
      } catch (err) {
        console.error(err);

        setError(
          err instanceof Error
            ? err.message
            : "Une erreur est survenue."
        );
      }
    },
    []
  );

  /* ------------------------------ DELETE SERVICE ----------------------------- */

  const handleDelete = useCallback(
    async () => {
      try {
        setIsDeleting(true);

        setError(null);

        if (!deleteId) {
          throw new Error(
            "Impossible de supprimer ce service."
          );
        }

        await deleteService(
          deleteId
        );

        setDeleteId(null);

        setMessage(
          "Service supprimé avec succès."
        );

        setSuccessOpen(true);
      } catch (err) {
        console.error(err);

        setErrorOpenDelete(true);

        setError(
          err instanceof Error
            ? err.message
            : "Erreur lors de la suppression."
        );

        throw err;
      } finally {
        setIsDeleting(false);
      }
    },
    [deleteId, deleteService]
  );

  /* ------------------------------ SUBMIT FORM ----------------------------- */

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      setError(null);

      if (
        !form.id ||
        !form.title ||
        !form.shortDescription ||
        !form.description
      ) {
        throw new Error(
          "Veuillez remplir tous les champs obligatoires."
        );
      }

      let imageUrl = form.image;

      /* ------------------------------ UPLOAD IMAGE ----------------------------- */

      if (form.imageFile) {
        try {
          if (
            form.imageFile.size >
            5 * 1024 * 1024
          ) {
            throw new Error(
              "La taille du fichier ne doit pas dépasser 5MB"
            );
          }

          if (
            !form.imageFile.type.startsWith(
              "image/"
            )
          ) {
            throw new Error(
              "Seuls les fichiers image sont autorisés"
            );
          }

          const user =
            auth.currentUser;

          if (!user) {
            throw new Error(
              "Vous devez être connecté pour télécharger une image"
            );
          }

          const token =
            await user.getIdToken();

          const formData =
            new FormData();

          formData.append(
            "file",
            form.imageFile
          );

          const response =
            await fetch(
              "/api/upload",
              {
                method: "POST",

                headers: {
                  Authorization: `Bearer ${token}`,
                },

                body: formData,
              }
            );

          const result =
            await response.json();

          if (!result.success) {
            throw new Error(
              result.message ||
                "Erreur lors du téléchargement"
            );
          }

          imageUrl = result.url;
        } catch (uploadError) {
          console.error(
            "Upload error:",
            uploadError
          );

          throw uploadError;
        }
      }

      const serviceData = {
        ...form,

        image: imageUrl,
      };

      /* ------------------------------ UPDATE ----------------------------- */

      if (editingService) {
        await updateService(
          editingService,
          serviceData
        );

        setMessage(
          "Service mis à jour avec succès."
        );
      } else {
        await createService(
          serviceData
        );

        setMessage(
          "Service ajouté avec succès."
        );
      }

      setSuccessOpen(true);

      closeModal();
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Une erreur est survenue."
      );

      throw err;
    } finally {
      setLoading(false);
    }
  };

  /* ------------------------------ TABLE COLUMNS ----------------------------- */

  const columns: Column<ServiceType>[] =
    useMemo(
      () => [
        {
          header: "ID",

          accessor: "id",
        },

        {
          header: "Service",

          accessor: "title",

          render: (value) => (
            <span className="font-medium text-gray-800 dark:text-white/90">
              {value}
            </span>
          ),
        },

        {
          header:
            "Description courte",

          accessor:
            "shortDescription",
        },

        {
          header:
            "Fonctionnalités",

          accessor: "features",

          render: (value) => (
            <div className="flex flex-wrap gap-1">
              {(
                value as string[]
              )
                ?.slice(0, 2)
                .map(
                  (
                    feature,
                    index
                  ) => (
                    <span
                      key={index}
                      className="rounded-full bg-gray-100 px-2 py-1 text-xs dark:bg-gray-800"
                    >
                      {feature}
                    </span>
                  )
                )}

              {(value as string[])
                ?.length > 2 && (
                <span className="text-xs text-gray-500">
                  +
                  {(
                    value as string[]
                  ).length - 2}
                </span>
              )}
            </div>
          ),
        },

        {
          header: "Actions",

          accessor: "id",

          render: (_, row) => (
            <div className="flex items-center gap-2">
              {/* Voir */}
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 dark:border-gray-700 dark:text-gray-400"
              >
                <Eye className="h-4 w-4" />
              </button>

              {/* Modifier */}
              <button
                type="button"
                onClick={() =>
                  handleEdit(row)
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-amber-500 hover:bg-amber-50 hover:text-amber-600 dark:border-gray-700 dark:text-gray-400"
              >
                <SquarePen className="h-4 w-4" />
              </button>

              {/* Supprimer */}
              <button
                type="button"
                onClick={() =>
                  setDeleteId(
                    row.id
                  )
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-red-500 hover:bg-red-50 hover:text-red-600 dark:border-gray-700 dark:text-gray-400"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ),
        },
      ],
      [handleEdit]
    );

  return (
    <>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.02] md:p-6">
        {/* HEADER */}
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium text-[#D01F1F]">
              Gestion des services
            </p>

            <h2 className="mt-1 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Liste des services
            </h2>

            <p className="mt-2 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
              Gérez les services et
              prestations affichés sur
              votre site vitrine.
            </p>
          </div>

          {/* ADD BUTTON */}
          <Button startIcon={<CirclePlus className="h-4 w-4" />}
            type="button"
            onClick={
              openCreateModal
            }
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D01F1F] px-5 py-3 text-sm font-medium text-white transition-all duration-200 hover:opacity-90"
          >
            Ajouter un service
          </Button>
        </div>

        {/* TABLE */}
        <DataTable
          data={paginatedServices}
          columns={columns}
        />

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="mt-6">
            <Pagination
              currentPage={
                currentPage
              }
              totalPages={
                totalPages
              }
              onPageChange={
                setCurrentPage
              }
            />
          </div>
        )}
      </div>

      {/* FORM MODAL */}
      <ServiceForm
        form={form}
        setForm={setForm}
        isOpen={isOpen}
        closeModal={closeModal}
        resetForm={resetForm}
        handleSubmit={
          handleSubmit
        }
        editingService={
          editingService
        }
        loading={loading}
        error={error}
        errorStatus={!!error}
      />

      {/* DELETE MODAL */}
      <ConfirmDeleteModal
        isOpen={
          deleteId !== null
        }
        onClose={() =>
          setDeleteId(null)
        }
        onConfirm={
          handleDelete
        }
        loading={isDeleting}
        error={error}
        errorStatus={
          errorOpenDelete
        }
      />

      {/* SUCCESS ALERT */}
      <AlertMessage
        type="success"
        message={message}
        isOpen={successOpen}
        onClose={() =>
          setSuccessOpen(false)
        }
      />
    </>
  );
};