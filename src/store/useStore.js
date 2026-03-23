import { create } from 'zustand';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export const useStore = create((set, get) => ({
  favorites: [],
  setFavorites: (favs) => set({ favorites: favs }),
  loadFavorites: async (userId) => {
    if (!userId) return;
    try {
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists() && docSnap.data().favorites) {
        set({ favorites: Object.values(docSnap.data().favorites) });
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
  },
  addFavorite: async (userId, symbol) => {
    const current = get().favorites;
    if (!current.includes(symbol)) {
      const updated = [...current, symbol];
      set({ favorites: updated });
      if (userId) {
        try {
          await setDoc(doc(db, 'users', userId), { favorites: updated }, { merge: true });
        } catch (error) {
          console.error("Error saving favorite:", error);
        }
      }
    }
  },
  removeFavorite: async (userId, symbol) => {
    const updated = get().favorites.filter((s) => s !== symbol);
    set({ favorites: updated });
    if (userId) {
      try {
        await setDoc(doc(db, 'users', userId), { favorites: updated }, { merge: true });
      } catch (error) {
        console.error("Error removing favorite:", error);
      }
    }
  }
}));
