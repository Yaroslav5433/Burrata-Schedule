import { create } from "zustand";

export const useUIStore = create((set) => ({
  errorOnReq: false,
  verificationPage: true,
  mobile: window.innerWidth < 1268,

  setErrorOnReq: (value) => set({ errorOnReq: value }),
  setVerificationPage: (value) => set({ verificationPage: value }),
  setMobile: (value) => set({ mobile: value }),
}));