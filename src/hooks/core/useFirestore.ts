/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export const useFirestore = (collectionName: string) => {
  const ref = collection(db, collectionName);

  const getAll = async () => {
    const snapshot = await getDocs(ref);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  };

  const create = async (data: any) => {
    return await addDoc(ref, data);
  };

  const update = async (id: string, data: any) => {
    const document = doc(db, collectionName, id);
    return await updateDoc(document, data);
  };

  const remove = async (id: string) => {
    const document = doc(db, collectionName, id);
    return await deleteDoc(document);
  };

  return {
    getAll,
    create,
    update,
    remove,
  };
};