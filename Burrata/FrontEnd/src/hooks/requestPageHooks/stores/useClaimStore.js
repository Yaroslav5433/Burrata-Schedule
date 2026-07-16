import { EMPTY_ARRAY_OF_SEVEN } from "@/utils/constants";
import { create } from "zustand";

export const useClaimStore = create((set) => ({
    claimValues: EMPTY_ARRAY_OF_SEVEN,
    blockClaims: false,

    setClaimValues: (claimValues) => set({ claimValues }),
    updateClaimValues: (index, value) =>
        set((state) => {
        const copy = [...state.claimValues];
        copy[index] = value;

        return {
            claimValues: copy,
        };
        }),

    setBlockClaims: (blockClaims) => set({ blockClaims }),
}))