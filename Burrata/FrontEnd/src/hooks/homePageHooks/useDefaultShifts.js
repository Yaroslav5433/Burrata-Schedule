import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { get_default_shifts } from "@/api/requests";

export function useDefaultShifts(enabled = true) {
    return useQuery({
        queryKey: ["defaultShifts"],

        queryFn: () =>
            get_default_shifts(),

        enabled: enabled,

        placeholderData: keepPreviousData,
    });
}