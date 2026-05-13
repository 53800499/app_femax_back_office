"use client";

import React from "react";
import { Modal } from "../ui/modal";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import TextArea from "../form/input/TextArea";
import { CirclePlus, SquarePen, X, Upload } from "lucide-react";

export interface ProjectFormData {
  title: string;
  category: string;
  client: string;
  status: string;
  description: string;
  image: string;
  imageFile?: File; // Nouveau champ pour stocker le fichier sélectionné
}

interface ProjectFormProps {
  loading: boolean;
  error: string | null;
  editingProject: string | null;
  form: ProjectFormData;
  isOpen: boolean;
  closeModal: () => void;
  setForm: React.Dispatch<React.SetStateAction<ProjectFormData>>;
  resetForm: () => void;
  handleSubmit: (e: React.FormEvent) => void;
  errorStatus?: boolean;
}

export default function ProjectForm({
  form,
  isOpen,
  closeModal,
  setForm,
  resetForm,
  handleSubmit,
  editingProject,
  loading,
  error,
  errorStatus,
}: ProjectFormProps) {
  return (
    <Modal isOpen={isOpen} onClose={closeModal} className="m-4 max-w-[800px]">
      <div className="rounded-3xl bg-white p-6 dark:bg-gray-900 lg:p-8">
        {/* Header */}
        <div className="mb-6">
          <p className="text-sm font-medium text-[#D01F1F]">
            Gestion des projets
          </p>

          <h4 className="mt-1 text-2xl font-semibold text-gray-800 dark:text-white/90">
            {editingProject
              ? "Modifier le projet"
              : "Ajouter un nouveau projet"}
          </h4>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Gérez les réalisations et projets affichés sur le site vitrine
            FEMAX.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Error */}
          {errorStatus && (
            <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Grid */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {/* Project title */}
            <div className="lg:col-span-2">
              <Label>Titre du projet</Label>

              <Input
                placeholder="Ex: Identité visuelle FEMAX"
                defaultValue={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
              />
            </div>

            {/* Category */}
            <div>
              <Label>Catégorie</Label>

              <Input
                placeholder="Ex: Design Graphique"
                defaultValue={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
              />
            </div>

            {/* Client */}
            <div>
              <Label>Client</Label>

              <Input
                placeholder="Ex: Entreprise Nova"
                defaultValue={form.client}
                onChange={(e) =>
                  setForm({ ...form, client: e.target.value })
                }
              />
            </div>

            {/* Status */}
            <div>
              <Label>Statut</Label>

              <select
                defaultValue={form.status}
                onChange={(e) =>
                  setForm({ ...form, status: e.target.value })
                }
                className="h-11 w-full rounded-xl border border-gray-300 bg-transparent px-4 text-sm outline-none transition focus:border-[#D01F1F] dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              >
                <option value="">Sélectionner un statut</option>
                <option value="Publié">Publié</option>
                <option value="En cours">En cours</option>
                <option value="Terminé">Terminé</option>
                <option value="En attente">En attente</option>
              </select>
            </div>

            {/* Image */}
            <div>
              <Label>Image du projet</Label>

              <div className="space-y-3">
                {/* Aperçu de l'image */}
                {form.image && (
                  <div className="relative">
                    <img
                      src={form.image}
                      alt="Aperçu"
                      className="h-32 w-full rounded-lg object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, image: "" })}
                      className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}

                {/* Input file caché */}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      // Stocker le fichier dans le formulaire au lieu de l'uploader
                      setForm({
                        ...form,
                        imageFile: file,
                        image: URL.createObjectURL(file) // Aperçu temporaire
                      });
                    }
                  }}
                  className="hidden"
                  id="image-upload"
                />

                {/* Bouton d'upload */}
                <label
                  htmlFor="image-upload"
                  className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 transition hover:border-[#D01F1F] hover:text-[#D01F1F] dark:border-gray-700 dark:text-gray-400"
                >
                  <Upload className="h-4 w-4" />
                  Choisir une image
                </label>
              </div>
            </div>

            {/* Description */}
            <div className="lg:col-span-2">
              <Label>Description</Label>

              <TextArea
                rows={5}
                placeholder="Décrivez le projet, les objectifs, les réalisations et les résultats obtenus..."
                value={form.description}
                onChange={(value) =>
                  setForm({ ...form, description: value })
                }
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 border-t border-gray-100 pt-5 dark:border-gray-800">
            <Button
              variant="outline"
              onClick={() => {
                resetForm();
                closeModal();
              }}
            >
              <X className="mr-1 h-4 w-4" />
              Annuler
            </Button>

            <Button >
              {!loading &&
                (editingProject ? (
                  <SquarePen className="mr-1 h-4 w-4" />
                ) : (
                  <CirclePlus className="mr-1 h-4 w-4" />
                ))}

              {editingProject ? "Mettre à jour" : "Ajouter le projet"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}