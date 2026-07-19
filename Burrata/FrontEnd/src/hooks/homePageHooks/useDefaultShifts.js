import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { get_default_shifts } from "@/api/requests";

export function useDefaultShifts(department, enabled = true) {
    return useQuery({
        queryKey: ["defaultShifts", department],

        queryFn: () =>
            get_default_shifts(department),

        enabled: enabled,

        placeholderData: keepPreviousData,
    });
}