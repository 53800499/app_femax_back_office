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

import DataTable, { Column } from "../tables/DataTable";
import Pagination from "../tables/Pagination";

import EquipeForm from "./form";
import { EquipeFormData } from "./form";

import ConfirmDeleteModal from "../common/ConfirmDeleteModal";
import AlertMessage from "../common/AlertMessage";

import { auth } from "@/lib/firebase";
import { EquipeType } from "@/server/modules/equipe/equipe.types";
import { useEquipes } from "@/hooks/modules/useEquipe";

/* ------------------------------ FORM INITIAL ----------------------------- */

const initialForm: EquipeFormData = {
  name: "",
  role: "",
  image: "",
  imageFile: undefined,
  description: "",
};

/* ------------------------------ COMPONENT ----------------------------- */

export const Equipe = () => {
  const [form, setForm] = useState<EquipeFormData>(initialForm);

  const [isOpen, setIsOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<string | null>(null);

  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpenDelete, setErrorOpenDelete] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  const {
    equipes: fetchedEquipes,
    getEquipes,
    createEquipe,
    updateEquipe,
    deleteEquipe,
  } = useEquipes();

  const itemsPerPage = 5;

  /* ------------------------------ PAGINATION ----------------------------- */

  const totalPages = Math.ceil(fetchedEquipes.length / itemsPerPage);

  const paginatedEquipes = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;

    return fetchedEquipes.slice(start, start + itemsPerPage);
  }, [fetchedEquipes, currentPage]);

  /* ------------------------------ FORM UTILS ----------------------------- */

  const resetForm = useCallback(() => {
    setForm(initialForm);
    setEditingMember(null);
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

  /* ------------------------------ EDIT ----------------------------- */

  const handleEdit = useCallback((member: EquipeType) => {
    if (!member) return;

    setEditingMember(String(member.id));

    setForm({
      name: member.name,
      role: member.role,
      image: member.image,
      imageFile: undefined,
      description: member.description,
    });

    setIsOpen(true);
  }, []);

  /* ------------------------------ DELETE ----------------------------- */

  const handleDelete = useCallback(async () => {
    try {
      setIsDeleting(true);
      setError(null);

      if (!deleteId) {
        throw new Error("Impossible de supprimer ce membre.");
      }

      await deleteEquipe(deleteId);

      setDeleteId(null);
      setMessage("Membre supprimé avec succès.");
      setSuccessOpen(true);
    } catch (err) {
      setErrorOpenDelete(true);
      setError(err instanceof Error ? err.message : "Erreur suppression");
      throw err;
    } finally {
      setIsDeleting(false);
    }
  }, [deleteId, deleteEquipe]);

  /* ------------------------------ SUBMIT ----------------------------- */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      if (!form.name || !form.role || !form.description) {
        throw new Error("Veuillez remplir tous les champs obligatoires.");
      }

      let imageUrl = form.image;

      /* ------------------------------ IMAGE UPLOAD ----------------------------- */

      if (form.imageFile) {
        const user = auth.currentUser;

        if (!user) throw new Error("Connexion requise");

        const token = await user.getIdToken();

        const formData = new FormData();
        formData.append("file", form.imageFile);

        const response = await fetch("/api/upload", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.message);
        }

        imageUrl = result.url;
      }

      const memberData = {
        ...form,
        image: imageUrl,
      };

      if (editingMember) {
        await updateEquipe(editingMember, memberData);
        setMessage("Membre mis à jour avec succès.");
      } else {
        const newMember: Omit<EquipeType, "id"> = {
          ...memberData,
        };

        await createEquipe(newMember);
        setMessage("Membre ajouté avec succès.");
      }

      setSuccessOpen(true);
      closeModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur serveur");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /* ------------------------------ TABLE ----------------------------- */

  const columns: Column<EquipeType>[] = useMemo(
    () => [
      {
        header: "ID",
        accessor: "id",
      },
      {
        header: "Nom",
        accessor: "name",
      },
      {
        header: "Rôle",
        accessor: "role",
      },
      {
        header: "Description",
        accessor: "description",
      },
      {
        header: "Actions",
        accessor: "id",
        render: (_, row) => (
          <div className="flex items-center gap-2">
            <button className="h-9 w-9 rounded-lg border flex items-center justify-center">
              <Eye className="h-4 w-4" />
            </button>

            <button
              onClick={() => handleEdit(row)}
              className="h-9 w-9 rounded-lg border flex items-center justify-center"
            >
              <SquarePen className="h-4 w-4" />
            </button>

            <button
              onClick={() => setDeleteId(String(row.id))}
              className="h-9 w-9 rounded-lg border flex items-center justify-center"
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
      <div className="rounded-2xl border bg-white p-6">
        {/* HEADER */}
        <div className="mb-6 flex justify-between">
          <div>
            <p className="text-sm font-medium text-[#D01F1F]">
              Gestion de l{"'"}équipe
            </p>

            <h2 className="text-2xl font-semibold">
              Liste des membres
            </h2>
          </div>

          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 rounded-xl bg-[#D01F1F] px-5 py-3 text-white"
          >
            <CirclePlus className="h-4 w-4" />
            Ajouter un membre
          </button>
        </div>

        {/* TABLE */}
        <DataTable data={paginatedEquipes} columns={columns} />

        {/* PAGINATION */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      {/* FORM MODAL */}
      <EquipeForm
        form={form}
        setForm={setForm}
        isOpen={isOpen}
        closeModal={closeModal}
        resetForm={resetForm}
        handleSubmit={handleSubmit}
        editingMember={editingMember}
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

      {/* SUCCESS */}
      <AlertMessage
        type="success"
        message={message}
        isOpen={successOpen}
        onClose={() => setSuccessOpen(false)}
      />
    </>
  );
};