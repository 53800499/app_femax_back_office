"use client";
import React from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { useUserProfile } from "../../hooks/core/useUserProfile";
import { useAuth } from "../../hooks/core/useAuth";

export default function UserInfoCard() {
  const { isOpen, openModal, closeModal } = useModal();
  const { profile, loading, updateProfile } = useUserProfile();
  const { user } = useAuth();

  const handleSave = async (formData: FormData) => {
    try {
      const updates = {
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
      };

      await updateProfile(updates);
      closeModal();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.02] lg:p-6">
        <div className="animate-pulse">
          <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
            Informations du compte
          </h3>
          <div className="space-y-4">
            <div className="h-4 bg-gray-300 rounded w-3/4 dark:bg-gray-700"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 dark:bg-gray-700"></div>
            <div className="h-4 bg-gray-300 rounded w-2/3 dark:bg-gray-700"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile || !user) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.02] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Informations du compte
        </h3>
        <p className="text-gray-500 dark:text-gray-400">Informations non disponibles</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.02] lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        {/* Informations du compte */}
        <div className="flex-1">
          <div className="mb-6">
            <h4 className="mt-1 text-xl font-semibold text-gray-800 dark:text-white/90">
              Informations du compte
            </h4>

            <p className="mt-2 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
              Gérez les informations de votre compte utilisateur et vos coordonnées.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-7">
            <div>
              <p className="mb-2 text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Email
              </p>

              <p className="text-sm font-semibold text-gray-800 dark:text-white/90">
                {profile.email}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Téléphone
              </p>

              <p className="text-sm font-semibold text-gray-800 dark:text-white/90">
                {profile.phone || 'Non défini'}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Date d{"'"}inscription
              </p>

              <p className="text-sm font-semibold text-gray-800 dark:text-white/90">
                {profile.createdAt.toLocaleDateString('fr-FR')}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Dernière modification
              </p>

              <p className="text-sm font-semibold text-gray-800 dark:text-white/90">
                {profile.updatedAt.toLocaleDateString('fr-FR')}
              </p>
            </div>

            <div className="lg:col-span-2">
              <p className="mb-2 text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Statut du compte
              </p>

              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                  Actif
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bouton */}
        <button
          onClick={openModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-medium text-gray-700 shadow-theme-xs transition-all duration-200 hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]"
        >
          <svg
            className="fill-current"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206Z"
            />
          </svg>

          Modifier les informations
        </button>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="m-4 max-w-[700px]"
      >
        <div className="no-scrollbar relative w-full overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-10">
          <div className="pr-10">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Modifier les informations du compte
            </h4>

            <p className="mb-8 text-sm text-gray-500 dark:text-gray-400">
              Mettez à jour vos coordonnées et informations de contact.
            </p>
          </div>

          <form
            className="flex flex-col"
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              handleSave(formData);
            }}
          >
            <div className="custom-scrollbar max-h-[500px] overflow-y-auto pr-2">
              {/* Informations du compte */}
              <div>
                <h5 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90">
                  Informations de contact
                </h5>

                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      defaultValue={profile.email}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="text"
                      defaultValue={profile.phone || ''}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex items-center justify-end gap-3">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Annuler
              </Button>

              <Button size="sm">
                Enregistrer les modifications
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}