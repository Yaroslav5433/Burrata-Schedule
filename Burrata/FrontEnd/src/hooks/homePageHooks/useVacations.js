import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { get_vacations_for_table } from "@/api/requests";

export function useVacations(dateStep, enabled = true) {
    return useQuery({
        queryKey: ["vacations", dateStep],

        queryFn: () =>
            get_vacations_for_table(dateStep),

        enabled: enabled,

        placeholderData: keepPreviousData,
    });
}