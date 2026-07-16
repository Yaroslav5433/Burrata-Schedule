import { create } from "zustand";

export const useUserStore = create((set) => ({
  userName: null,
  userSavedClaims: [],
  userMessage: "",

  setUserName: (userName) => set({ userName }),
  setUserSavedClaims: (claims) => set({ userSavedClaims: claims }),
  setUserMessage: (message) => set({ userMessage: message }),

  setUserInfo: ({ username, claims, message }) =>
        set({
            userName: username,
            userSavedClaims: claims ?? [],
            userMessage: message ?? "",
        }),
}));