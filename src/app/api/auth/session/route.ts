import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/server/firebase/admin';

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json(
        { error: 'Token manquant' },
        { status: 400 }
      );
    }

    // Vérifier le token
    const decodedToken = await auth.verifyIdToken(idToken);

    // Créer un cookie de session
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 jours
    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });

    const response = NextResponse.json({ success: true });

    // Définir le cookie de session
    response.cookies.set('__session', sessionCookie, {
      maxAge: expiresIn / 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Erreur lors de la création de la session:', error);
    return NextResponse.json(
      { error: 'Erreur d\'authentification' },
      { status: 401 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });

  // Supprimer le cookie de session
  response.cookies.set('__session', '', {
    maxAge: 0,
    path: '/',
  });

  return response;
}