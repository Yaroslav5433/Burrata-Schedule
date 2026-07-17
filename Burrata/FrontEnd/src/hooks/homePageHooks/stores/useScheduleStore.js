import { create } from "zustand";

export const useScheduleStore = create((set) => ({
    dateStep: 0,
    isEdit: false,
    draftSchedule: null,
    showClaims: true,
    showVacations: false,
    customEdit: false,
    days: {},

    setDateStep: (dateStep) => set({ dateStep }),
    setIsEdit: (isEdit) => set({ isEdit }),
    setDraftSchedule: (draftSchedule) => set({ draftSchedule }),
    setShowClaims: (showClaims) => set({ showClaims }),
    setShowVacations: (showVacations) => set({ showVacations }),
    setCustomEdit: (customEdit) => set({ customEdit }),
    setDays: (days) => set({ days }),
}))