import { get_total_max } from "@/api/requests";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

export function useTotalMaxShifts(userName, enabled = true) {
    return useQuery({
        queryKey: ["totalMax", userName],

        queryFn: () => get_total_max(userName),

        enabled: enabled && !!userName,

        placeholderData: keepPreviousData,
    });
}