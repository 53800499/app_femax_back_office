"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "./useAuth";

export interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  phone?: string;
  bio?: string;
  location?: string;
  role: string;
  avatar?: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    whatsapp?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export function useUserProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setProfile(null);
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setProfile({
          id: user.uid,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as UserProfile);
      } else {
        // Create default profile if it doesn't exist
        const defaultProfile: Omit<UserProfile, 'id'> = {
          displayName: user.displayName || user.email?.split('@')[0] || 'Admin',
          email: user.email || '',
          role: 'Administrateur',
          location: 'Abomey-Calavi, Zogbadjè',
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        await setDoc(docRef, defaultProfile);
        setProfile({
          id: user.uid,
          ...defaultProfile,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors du chargement du profil");
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>>) => {
    if (!user || !profile) return;

    try {
      setLoading(true);
      setError(null);
      const docRef = doc(db, "users", user.uid);
      const updatedData = {
        ...updates,
        updatedAt: new Date(),
      };
      await updateDoc(docRef, updatedData);

      setProfile(prev => prev ? { ...prev, ...updatedData } : null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la mise à jour du profil");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    profile,
    loading,
    error,
    updateProfile,
    refetchProfile: fetchProfile,
  };
}