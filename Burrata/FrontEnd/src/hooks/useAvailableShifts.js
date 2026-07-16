import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { get_shifts_values } from "@/api/requests";

export function useAvailableShifts(userName, enabled = true) {
    return useQuery({
        queryKey: ["availableShifts", userName],

        queryFn: () =>
            get_shifts_values(userName),

        enabled: enabled && !!userName,

        placeholderData: keepPreviousData,
    });
}