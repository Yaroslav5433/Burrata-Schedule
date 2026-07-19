import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { get_vacations } from "@/api/requests";

export function useVacations(enabled = true) {
    return useQuery({
        queryKey: ["vacations"],

        queryFn: () =>
            get_vacations(),

        enabled: enabled,

        placeholderData: keepPreviousData,
    });
}