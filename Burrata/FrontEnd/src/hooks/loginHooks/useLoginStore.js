import { create } from "zustand";

export const useLoginStore = create((set) => ({
    errorOnAuth: false,

    setErrorOnAuth: (errorOnAuth) => set({errorOnAuth}),
}))