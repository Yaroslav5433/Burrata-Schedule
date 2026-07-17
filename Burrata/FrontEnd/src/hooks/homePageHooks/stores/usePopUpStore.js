import { create } from "zustand";

export const usePopupStore = create((set) => ({
    popup: null,

    openPopup: (name) => set({ popup: name }),

    closePopup: () => set({ popup: null })
}));