"use client";

import React from "react";
import { Modal } from "../ui/modal";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import TextArea from "../form/input/TextArea";
import { CirclePlus, SquarePen, X, Upload } from "lucide-react";

export interface BlogFormData {
  title: string;
  category: string;
  author: string;
  status: string;
  excerpt: string;
  content: string;
  image: string;
  imageFile?: File;
}

interface BlogFormProps {
  loading: boolean;
  error: string | null;
  editingPost: string | null;
  form: BlogFormData;
  isOpen: boolean;
  closeModal: () => void;
  setForm: React.Dispatch<React.SetStateAction<BlogFormData>>;
  resetForm: () => void;
  handleSubmit: (e: React.FormEvent) => void;
  errorStatus?: boolean;
}

export default function BlogForm({
  form,
  isOpen,
  closeModal,
  setForm,
  resetForm,
  handleSubmit,
  editingPost,
  loading,
  error,
  errorStatus,
}: BlogFormProps) {
  return (
    <Modal isOpen={isOpen} onClose={closeModal} className="m-4 max-w-[900px]">
      <div className="rounded-3xl bg-white p-6 dark:bg-gray-900 lg:p-8">
        {/* Header */}
        <div className="mb-6">
          <p className="text-sm font-medium text-[#D01F1F]">
            Gestion du blog
          </p>

          <h4 className="mt-1 text-2xl font-semibold text-gray-800 dark:text-white/90">
            {editingPost
              ? "Modifier un article"
              : "Ajouter un nouvel article"}
          </h4>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Gérez les articles affichés sur le blog de votre application
            vitrine.
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
            {/* Title */}
            <div className="lg:col-span-2">
              <Label>Titre de l’article</Label>

              <Input
                placeholder="Ex: Les tendances du design web en 2026"
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
                placeholder="Ex: Design, Développement, Marketing"
                defaultValue={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
              />
            </div>

            {/* Author */}
            <div>
              <Label>Auteur</Label>

              <Input
                placeholder="Ex: FEMAX Studio"
                defaultValue={form.author}
                onChange={(e) =>
                  setForm({ ...form, author: e.target.value })
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
                <option value="Brouillon">Brouillon</option>
                <option value="Planifié">Planifié</option>
              </select>
            </div>

            {/* Featured Image */}
            <div>
              <Label>Image de couverture</Label>

              <div className="space-y-3">
                {/* Preview */}
                {form.image && (
                  <div className="relative">
                    <img
                      src={form.image}
                      alt="Aperçu"
                      className="h-40 w-full rounded-xl object-cover"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setForm({
                          ...form,
                          image: "",
                          imageFile: undefined,
                        })
                      }
                      className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}

                {/* Hidden file input */}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="image-upload"
                  onChange={(e) => {
                    const file = e.target.files?.[0];

                    if (file) {
                      setForm({
                        ...form,
                        imageFile: file,
                        image: URL.createObjectURL(file),
                      });
                    }
                  }}
                />

                {/* Upload button */}
                <label
                  htmlFor="image-upload"
                  className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 transition hover:border-[#D01F1F] hover:text-[#D01F1F] dark:border-gray-700 dark:text-gray-400"
                >
                  <Upload className="h-4 w-4" />
                  Choisir une image
                </label>
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <Label>Résumé de l’article</Label>

              <TextArea
                rows={6}
                placeholder="Ajoutez un court résumé qui sera affiché sur la page du blog..."
                value={form.excerpt}
                onChange={(value) =>
                  setForm({ ...form, excerpt: value })
                }
              />
            </div>

            {/* Content */}
            <div className="lg:col-span-2">
              <Label>Contenu de l’article</Label>

              <TextArea
                rows={10}
                placeholder="Rédigez ici le contenu complet de l’article..."
                value={form.content}
                onChange={(value) =>
                  setForm({ ...form, content: value })
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
              startIcon={<X className="mr-1 h-4 w-4" />}
            >
              Annuler
            </Button>

            <Button
              type="submit"
              loading={loading}
              startIcon={
                editingPost ? (
                  <SquarePen className="mr-1 h-4 w-4" />
                ) : (
                  <CirclePlus className="mr-1 h-4 w-4" />
                )
              }
            >
              {editingPost
                ? "Mettre à jour l’article"
                : "Publier l’article"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}