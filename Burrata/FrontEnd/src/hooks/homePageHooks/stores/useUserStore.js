import { create } from "zustand";

export const useUserStore = create((set) => ({
    userTextName: '',
    addUser: {'state': false, 'isTrainee': false},

    setUserTextName: (userTextName) => set({ userTextName }),
    setAddUser: (state, isTrainee) => set({'addUser': state, 'isTrainee': isTrainee})
}))