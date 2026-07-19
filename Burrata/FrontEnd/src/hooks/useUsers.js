import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { get_all_users_request } from "@/api/requests";

export function useUsers(department, enabled = true) {
    return useQuery({
        queryKey: ["users", department],

        queryFn: () =>
            get_all_users_request(department),

        enabled: enabled,

        placeholderData: keepPreviousData,
    });
}