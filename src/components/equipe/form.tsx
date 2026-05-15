"use client";

import React from "react";

import { Modal } from "../ui/modal";

import Label from "../form/Label";

import Input from "../form/input/InputField";

import Button from "../ui/button/Button";

import TextArea from "../form/input/TextArea";

import {
  CirclePlus,
  SquarePen,
  X,
  Upload,
} from "lucide-react";

export interface EquipeFormData {
  id?: number;

  name: string;

  role: string;

  image: string;

  description: string;

  imageFile?: File;
}

interface EquipeFormProps {
  loading: boolean;

  error: string | null;

  editingMember: string | null;

  form: EquipeFormData;

  isOpen: boolean;

  closeModal: () => void;

  setForm: React.Dispatch<
    React.SetStateAction<EquipeFormData>
  >;

  resetForm: () => void;

  handleSubmit: (
    e: React.FormEvent
  ) => void;

  errorStatus?: boolean;
}

export default function EquipeForm({
  form,

  isOpen,

  closeModal,

  setForm,

  resetForm,

  handleSubmit,

  editingMember,

  loading,

  error,

  errorStatus,
}: EquipeFormProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      className="m-4 max-w-[900px]"
    >
      <div className="rounded-3xl bg-white p-6 dark:bg-gray-900 lg:p-8">
        {/* Header */}
        <div className="mb-6">
          <p className="text-sm font-medium text-[#D01F1F]">
            Gestion de l’équipe
          </p>

          <h4 className="mt-1 text-2xl font-semibold text-gray-800 dark:text-white/90">
            {editingMember
              ? "Modifier un membre"
              : "Ajouter un membre"}
          </h4>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Gérez les membres affichés sur la page équipe de votre site vitrine.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* Error */}
          {errorStatus && (
            <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Grid */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {/* ID */}
            {/* <div>
              <Label>ID</Label>

              <Input
                type="number"
                placeholder="Ex: 1"
                defaultValue={String(
                  form.id || ""
                )}
                onChange={(e) =>
                  setForm({
                    ...form,

                    id: Number(
                      e.target.value
                    ),
                  })
                }
              />
            </div> */}

            {/* Name */}
            <div>
              <Label>Nom</Label>

              <Input
                placeholder="Ex: John Doe"
                defaultValue={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,

                    name:
                      e.target.value,
                  })
                }
              />
            </div>

            {/* Role */}
            <div className="lg:col-span-2">
              <Label>Rôle</Label>

              <Input
                placeholder="Ex: Développeur Frontend"
                defaultValue={form.role}
                onChange={(e) =>
                  setForm({
                    ...form,

                    role:
                      e.target.value,
                  })
                }
              />
            </div>

            {/* Image */}
            <div>
              <Label>
                Photo du membre
              </Label>

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

                          imageFile:
                            undefined,
                        })
                      }
                      className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}

                {/* Hidden input */}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="image-upload"
                  onChange={(e) => {
                    const file =
                      e.target.files?.[0];

                    if (file) {
                      setForm({
                        ...form,

                        imageFile:
                          file,

                        image:
                          URL.createObjectURL(
                            file
                          ),
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

            {/* Description */}
            <div>
              <Label>Description</Label>

              <TextArea
                rows={6}
                placeholder="Ajoutez une courte biographie ou présentation du membre..."
                value={form.description}
                onChange={(value) =>
                  setForm({
                    ...form,

                    description:
                      value,
                  })
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
              startIcon={
                <X className="mr-1 h-4 w-4" />
              }
            >
              Annuler
            </Button>

            <Button
              type="submit"
              loading={loading}
              startIcon={
                editingMember ? (
                  <SquarePen className="mr-1 h-4 w-4" />
                ) : (
                  <CirclePlus className="mr-1 h-4 w-4" />
                )
              }
            >
              {editingMember
                ? "Mettre à jour"
                : "Ajouter le membre"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}