import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useStore = create(
  persist(
    (set) => ({
      favorites: [],

      addFavorite: (symbol) => 
        set((state) => {
          if (!state.favorites.includes(symbol)) {
            return { favorites: [...state.favorites, symbol] };
          }
          return state;
        }),

      removeFavorite: (symbol) => 
        set((state) => ({
          favorites: state.favorites.filter((s) => s !== symbol)
        })),
        
      // For backwards compatibility since we removed firebase load logic
      loadFavorites: () => {}, 
    }),
    {
      name: 'gvk-stock-storage', // unique name
      storage: createJSONStorage(() => localStorage), 
    }
  )
);
