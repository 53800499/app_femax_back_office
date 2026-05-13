import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/server/firebase/admin';

export async function verifyAuth(request: NextRequest) {
  try {
    const token = request.cookies.get('__session')?.value;

    if (!token) {
      return null;
    }

    const decodedToken = await auth.verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    console.error('Erreur de vérification du token:', error);
    return null;
  }
}

export function redirectToLogin(request: NextRequest) {
  const loginUrl = new URL('/auth/signin', request.url);
  loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}