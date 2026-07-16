import { get_limits } from "@/api/requests";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

export function useLimits(userName) {
    return useQuery({
        queryKey: ["limits", userName],
        queryFn: () => get_limits(userName),
        placeholderData: keepPreviousData,
        enabled: !!userName,
    });
}