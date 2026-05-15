"use client";

import React, { useState } from "react";

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

export interface ServiceFormData {
  id: number;

  title: string;

  shortDescription: string;

  description: string;

  image: string;

  imageFile?: File;

  features: string[];
}

interface ServiceFormProps {
  loading: boolean;

  error: string | null;

  editingService: number | null;

  form: ServiceFormData;

  isOpen: boolean;

  closeModal: () => void;

  setForm: React.Dispatch<
    React.SetStateAction<ServiceFormData>
  >;

  resetForm: () => void;

  handleSubmit: (
    e: React.FormEvent
  ) => void;

  errorStatus?: boolean;
}

export default function ServiceForm({
  form,
  isOpen,
  closeModal,
  setForm,
  resetForm,
  handleSubmit,
  editingService,
  loading,
  error,
  errorStatus,
}: ServiceFormProps) {
  const [featureInput, setFeatureInput] =
    useState("");

  const addFeature = () => {
    if (
      featureInput.trim() &&
      !form.features.includes(
        featureInput.trim()
      )
    ) {
      setForm({
        ...form,

        features: [
          ...form.features,
          featureInput.trim(),
        ],
      });

      setFeatureInput("");
    }
  };

  const removeFeature = (
    feature: string
  ) => {
    setForm({
      ...form,

      features: form.features.filter(
        (item) => item !== feature
      ),
    });
  };

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
            Gestion des services
          </p>

          <h4 className="mt-1 text-2xl font-semibold text-gray-800 dark:text-white/90">
            {editingService
              ? "Modifier un service"
              : "Ajouter un nouveau service"}
          </h4>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Gérez les services affichés
            sur votre site vitrine.
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
            <div>
              <Label>ID du service</Label>

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
            </div>

            {/* Title */}
            <div>
              <Label>
                Titre du service
              </Label>

              <Input
                placeholder="Ex: Développement Web"
                defaultValue={form.title}
                onChange={(e) =>
                  setForm({
                    ...form,
                    title:
                      e.target.value,
                  })
                }
              />
            </div>

            {/* Short description */}
            <div className="lg:col-span-2">
              <Label>
                Description courte
              </Label>

              <Input
                placeholder="Ex: Création de sites web modernes et performants"
                defaultValue={
                  form.shortDescription
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    shortDescription:
                      e.target.value,
                  })
                }
              />
            </div>

            {/* Featured Image */}
            <div>
              <Label>
                Image du service
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

                {/* Hidden file input */}
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

            {/* Features */}
            <div>
              <Label>
                Fonctionnalités
              </Label>

              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="Ajouter une fonctionnalité"
                    value={
                      featureInput
                    }
                    onChange={(e) =>
                      setFeatureInput(
                        e.target.value
                      )
                    }
                  />

                  <Button
                    startIcon={<CirclePlus className="h-4 w-4" />}
                    onClick={addFeature}
                  >
                    Ajouter
                  </Button>
                </div>

                {/* Features list */}
                <div className="flex flex-wrap gap-2">
                  {form.features.map(
                    (
                      feature,
                      index
                    ) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800"
                      >
                        <span>
                          {feature}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            removeFeature(
                              feature
                            )
                          }
                          className="text-red-500 hover:text-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="lg:col-span-2">
              <Label>
                Description complète
              </Label>

              <TextArea
                rows={8}
                placeholder="Décrivez en détail le service proposé..."
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
                editingService ? (
                  <SquarePen className="mr-1 h-4 w-4" />
                ) : (
                  <CirclePlus className="mr-1 h-4 w-4" />
                )
              }
            >
              {editingService
                ? "Mettre à jour le service"
                : "Ajouter le service"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}