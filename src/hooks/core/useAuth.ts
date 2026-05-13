"use client";

import { useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      setUser(result.user);

      // Créer la session côté serveur
      const idToken = await result.user.getIdToken();
      await fetch('/api/auth/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });

      return result.user;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await signInWithEmailAndPassword(auth, email, password);
      setUser(result.user);

      // Créer la session côté serveur
      const idToken = await result.user.getIdToken();
      await fetch('/api/auth/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });

      return result.user;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);

      // Supprimer la session côté serveur
      await fetch('/api/auth/session', {
        method: 'DELETE',
      });

      await firebaseSignOut(auth);
      setUser(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    signUp,
    signIn,
    signOut,
  };
}
