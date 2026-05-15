
import Dashboard from "@/components/dashboard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard Admin | FEMAX",
  description:
    "Espace administrateur FEMAX pour gérer les contenus, projets, services et publications.",
};

export default function Page() {
  return (
    <Dashboard />
  );
}