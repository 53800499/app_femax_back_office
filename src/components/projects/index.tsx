"use client";

import React, {
  useCallback,
  useEffect,
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
import ProjectForm, {
  ProjectFormData,
} from "./form";

import ConfirmDeleteModal from "../common/ConfirmDeleteModal";
import AlertMessage from "../common/AlertMessage";
import { useProjects } from "@/hooks/modules/useProject";
import { ProjectType } from "@/server/modules/project/project.types";
import { auth } from "@/lib/firebase";


const initialForm: ProjectFormData = {
  title: "",
  category: "",
  client: "",
  status: "",
  description: "",
  image: "",
  imageFile: undefined,
};

const statusStyles: Record<string, string> = {
  Publié:
    "bg-success-50 text-success-700 dark:bg-success-500/15 dark:text-success-400",

  "En cours":
    "bg-warning-50 text-warning-700 dark:bg-warning-500/15 dark:text-warning-400",

  Terminé:
    "bg-blue-light-50 text-blue-light-700 dark:bg-blue-light-500/15 dark:text-blue-light-400",

  "En attente":
    "bg-error-50 text-error-700 dark:bg-error-500/15 dark:text-error-400",
};

export const Project = () => {
  const [form, setForm] =
    useState<ProjectFormData>(initialForm);

  const [isOpen, setIsOpen] = useState(false);

  const [editingProject, setEditingProject] =
    useState<string | null>(null);

  const [deleteId, setDeleteId] =
    useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  const [isDeleting, setIsDeleting] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [message, setMessage] = useState("");

  const [successOpen, setSuccessOpen] =
    useState(false);

  const [errorOpenDelete, setErrorOpenDelete] =
    useState(false);

  const [currentPage, setCurrentPage] =
    useState(1);

  const {
    projects: fetchedProjects,
    loading: fetchingProjects,
    getProjects,
    createProject,
    updateProject,
    deleteProject,
  } = useProjects();

  const itemsPerPage = 5;

  /* ------------------------------ PAGINATION ----------------------------- */

  const totalPages = Math.ceil(
    fetchedProjects.length / itemsPerPage
  );

  const paginatedProjects = useMemo(() => {
    const start =
      (currentPage - 1) * itemsPerPage;

    return fetchedProjects.slice(
      start,
      start + itemsPerPage
    );
  }, [fetchedProjects, currentPage]);

  /* ------------------------------ FORM UTILS ----------------------------- */

  const resetForm = useCallback(() => {
    setForm(initialForm);
    setEditingProject(null);
    setError(null);
  }, []);

  const closeModal = useCallback(() => {
    resetForm();
    setIsOpen(false);
  }, [resetForm]);

  const openCreateModal = useCallback(() => {
    resetForm();
    setIsOpen(true);
  }, [resetForm]);

  /* ------------------------------ EDIT PROJECT ----------------------------- */

  const handleEdit = useCallback(
    (project: ProjectType) => {
      try {
        if (!project) {
          throw new Error(
            "Projet introuvable."
          );
        }
        console.log("Editing project:", project);

        setEditingProject(project.id || null);

        setForm({
          title: project.title,
          category: project.category,
          client: project.client,
          status: project.status,
          description:
            project.description || "",
          image: project.image || "",
          imageFile: undefined, // Pas de fichier lors de l'édition
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

  /* ------------------------------ DELETE PROJECT ----------------------------- */

  const handleDelete = useCallback(async () => {
    try {
      setIsDeleting(true);
      setError(null);

      if (!deleteId) {
        throw new Error(
          "Impossible de supprimer ce projet."
        );
      }

      await deleteProject(deleteId);

      setDeleteId(null);

      setMessage(
        "Projet supprimé avec succès."
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
  }, [deleteId, deleteProject]);

  /* ------------------------------ SUBMIT FORM ----------------------------- */

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      if (
        !form.title ||
        !form.category ||
        !form.client ||
        !form.status
      ) {
        throw new Error(
          "Veuillez remplir tous les champs obligatoires."
        );
      }

      let imageUrl = form.image;

      // Uploader l'image si un fichier a été sélectionné
      if (form.imageFile) {
        try {
          // Vérifier la taille (max 5MB)
          if (form.imageFile.size > 5 * 1024 * 1024) {
            throw new Error("La taille du fichier ne doit pas dépasser 5MB");
          }

          // Vérifier le type
          if (!form.imageFile.type.startsWith("image/")) {
            throw new Error("Seuls les fichiers image sont autorisés");
          }

          // Obtenir le token d'authentification
          const user = auth.currentUser;
          if (!user) {
            throw new Error("Vous devez être connecté pour télécharger une image");
          }

          const token = await user.getIdToken();

          // Créer FormData
          const formData = new FormData();
          formData.append("file", form.imageFile);

          // Upload vers l'API
          const response = await fetch("/api/upload", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          });

          const result = await response.json();

          if (!result.success) {
            throw new Error(result.message || "Erreur lors du téléchargement");
          }

          imageUrl = result.url;
        } catch (uploadError) {
          console.error("Upload error:", uploadError);
          throw uploadError;
        }
      }

      const projectData = {
        ...form,
        image: imageUrl,
      };

      if (editingProject) {
        await updateProject(editingProject, projectData);

        setMessage(
          "Projet mis à jour avec succès."
        );
      } else {
        const newProject: Omit<ProjectType, 'id'> = {
          ...projectData,
          createdAt:
            new Date().toLocaleDateString(
              "fr-FR"
            ),
        };
        console.log("Creating project:", newProject);
        await createProject(newProject);

        setMessage(
          "Projet ajouté avec succès."
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

  const columns: Column<ProjectType>[] =
    useMemo(
      () => [
        {
          header: "ID",
          accessor: "id",
        },

        {
          header: "Projet",
          accessor: "title",

          render: (value) => (
            <span className="font-medium text-gray-800 dark:text-white/90">
              {value}
            </span>
          ),
        },

        {
          header: "Catégorie",
          accessor: "category",
        },

        {
          header: "Client",
          accessor: "client",
        },

        {
          header: "Statut",
          accessor: "status",

          render: (value) => (
            <span
              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                statusStyles[value as string]
              }`}
            >
              {value}
            </span>
          ),
        },

        {
          header: "Date",
          accessor: "createdAt",
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
                  setDeleteId(row.id || null)
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
              Gestion des projets
            </p>

            <h2 className="mt-1 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Liste des réalisations FEMAX
            </h2>

            <p className="mt-2 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
              Gérez les projets,
              réalisations et prestations
              affichés sur votre site
              vitrine FEMAX.
            </p>
          </div>

          {/* ADD BUTTON */}
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D01F1F] px-5 py-3 text-sm font-medium text-white transition-all duration-200 hover:opacity-90"
          >
            <CirclePlus className="h-4 w-4" />
            Ajouter un projet
          </button>
        </div>

        {/* TABLE */}
        <DataTable
          data={paginatedProjects}
          columns={columns}
        />

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      {/* FORM MODAL */}
      <ProjectForm
        form={form}
        setForm={setForm}
        isOpen={isOpen}
        closeModal={closeModal}
        resetForm={resetForm}
        handleSubmit={handleSubmit}
        editingProject={editingProject}
        loading={loading}
        error={error}
        errorStatus={!!error}
      />

      {/* DELETE MODAL */}
      <ConfirmDeleteModal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={isDeleting}
        error={error}
        errorStatus={errorOpenDelete}
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