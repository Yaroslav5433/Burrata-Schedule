import { create } from "zustand";

export const useUIStore = create((set) => ({
  errorOnReq: false,
  verificationPage: true,

  setErrorOnReq: (value) => set({ errorOnReq: value }),
  setVerificationPage: (value) => set({ verificationPage: value }),
}));