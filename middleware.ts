import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth, redirectToLogin } from '@/server/middleware/auth';
import { checkPermissions } from '@/server/middleware/permissions';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Routes publiques qui ne nécessitent pas d'authentification
  const publicRoutes = [
    '/',
    '/signin',
    '/signup',
    '/api/auth',
  ];

  // Vérifier si la route est publique
  const isPublicRoute = publicRoutes.some(route =>
    pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Vérifier l'authentification pour les routes protégées
  const user = await verifyAuth(request);

  if (!user) {
    // Rediriger vers la page de connexion pour les routes de page
    if (!pathname.startsWith('/api/')) {
      return redirectToLogin(request);
    }

    // Retourner une erreur 401 pour les routes API
    return new NextResponse(
      JSON.stringify({ error: 'Authentification requise' }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  // Vérifier les permissions pour les routes admin
  if (pathname.startsWith('/admin') && !checkPermissions(user)) {
    if (!pathname.startsWith('/api/')) {
      return redirectToLogin(request);
    }

    return new NextResponse(
      JSON.stringify({ error: 'Permissions insuffisantes' }),
      {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files with extensions
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
};