import { create } from "zustand";

export const useVacationsStore = create((set) => ({
    username: '',
    addVacation: false,
    dates: '',

    setUsername: (username) => set({username}),
    setAddVacation: (addVacation) => set({ addVacation }),
    setDates: (dates) => set({dates})
}))