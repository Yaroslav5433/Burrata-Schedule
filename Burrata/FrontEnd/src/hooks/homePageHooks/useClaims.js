import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { get_all_claims_request } from "@/api/requests";

export function useClaims(department, datestep, enabled = true) {
    return useQuery({
        queryKey: ["claims", department],

        queryFn: () =>
            get_all_claims_request(department, datestep),

        enabled: enabled,

        placeholderData: keepPreviousData,
    });
}