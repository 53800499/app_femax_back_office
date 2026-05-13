import type { Metadata } from "next";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = {
  title: "Dashboard Admin | FEMAX",
  description:
    "Espace administrateur FEMAX pour gérer les contenus, projets, services et publications.",
};

export default function Dashboard() {
  const user = {
    user_metadata: {
      full_name: "Administrateur FEMAX",
    },
    email: "admin@femax.bj",
  };

  const activities = [
    {
      id: 1,
      title: "Mise à jour du portfolio BTP",
      category: "Projet",
      author: "Jean Kossi",
      date: "11 Mai 2026",
      status: "Publié",
    },
    {
      id: 2,
      title: "Ajout d’un nouvel article blog",
      category: "Blog",
      author: "Amina Diallo",
      date: "10 Mai 2026",
      status: "Brouillon",
    },
    {
      id: 3,
      title: "Modification du service Imprimerie",
      category: "Service",
      author: "David Mensah",
      date: "09 Mai 2026",
      status: "Publié",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <div className="rounded-3xl border border-red-100 bg-white p-6 shadow-sm">
        <p className="text-sm text-gray-500">Bienvenue sur le back-office</p>

        <h1 className="mt-1 text-3xl font-bold text-gray-900">
          {user?.user_metadata?.full_name ??
            user?.email ??
            "Administrateur"}
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
          Gérez facilement les contenus de votre plateforme FEMAX :
          services, projets, articles de blog, galerie et informations
          de l’entreprise.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border border-red-100 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Services publiés</p>

          <h3 className="mt-3 text-3xl font-bold text-[#D01F1F]">12</h3>

          <p className="mt-2 text-xs text-gray-500">
            Services actuellement visibles
          </p>
        </div>

        <div className="rounded-3xl border border-red-100 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Projets réalisés</p>

          <h3 className="mt-3 text-3xl font-bold text-[#D01F1F]">48</h3>

          <p className="mt-2 text-xs text-gray-500">
            Portfolio mis à jour récemment
          </p>
        </div>

        <div className="rounded-3xl border border-red-100 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Articles de blog</p>

          <h3 className="mt-3 text-3xl font-bold text-[#D01F1F]">24</h3>

          <p className="mt-2 text-xs text-gray-500">
            Contenus publiés sur le site
          </p>
        </div>

        <div className="rounded-3xl border border-red-100 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Membres d’équipe</p>

          <h3 className="mt-3 text-3xl font-bold text-[#D01F1F]">08</h3>

          <p className="mt-2 text-xs text-gray-500">
            Profils affichés sur le site
          </p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-3xl border border-red-100 bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Activités récentes
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Dernières modifications effectuées sur la plateforme.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/blog"
              className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Gérer le blog
            </Link>

            <Link
              href="/admin/projects"
              className="rounded-xl bg-[#D01F1F] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#b91c1c]"
            >
              Voir les projets
            </Link>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-500">
                  Titre
                </th>

                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-500">
                  Catégorie
                </th>

                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-500">
                  Auteur
                </th>

                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-500">
                  Date
                </th>

                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-500">
                  Statut
                </th>
              </tr>
            </thead>

            <tbody>
              {activities.map((activity) => (
                <tr
                  key={activity.id}
                  className="border-b border-gray-100 last:border-none"
                >
                  <td className="px-4 py-4 font-medium text-gray-800">
                    {activity.title}
                  </td>

                  <td className="px-4 py-4 text-sm text-gray-600">
                    {activity.category}
                  </td>

                  <td className="px-4 py-4 text-sm text-gray-600">
                    {activity.author}
                  </td>

                  <td className="px-4 py-4 text-sm text-gray-600">
                    {activity.date}
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        activity.status === "Publié"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {activity.status}
                    </span>
                  </td>
                </tr>
              ))}

              {activities.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-10 text-center text-sm text-gray-500"
                  >
                    Aucune activité récente.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}