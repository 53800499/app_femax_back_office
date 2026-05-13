import { NextRequest, NextResponse } from 'next/server';

export function checkPermissions(user: any, requiredRole?: string) {
  // Pour l'instant, tous les utilisateurs authentifiés ont accès
  // On peut étendre cela plus tard avec des rôles spécifiques
  if (!user) {
    return false;
  }

  if (requiredRole) {
    // Vérifier le rôle de l'utilisateur si nécessaire
    // Pour l'instant, on retourne true pour tous les utilisateurs authentifiés
    return true;
  }

  return true;
}

export function createProtectedResponse(request: NextRequest, message: string = 'Accès non autorisé') {
  return new NextResponse(
    JSON.stringify({ error: message }),
    {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}