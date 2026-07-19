import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { get_all_claims_request } from "@/api/requests";

export function useClaims(department, dateStep, enabled = true) {
    return useQuery({
        queryKey: ["claims", department, dateStep],

        queryFn: () =>
            get_all_claims_request(department, dateStep),

        enabled: enabled,

        placeholderData: keepPreviousData,
    });
}