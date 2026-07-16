import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { get_dates_request } from "@/api/requests";

export function useDates(dateStep) {
    return useQuery({
        queryKey: ["dates", dateStep],
        queryFn: () => get_dates_request(dateStep),
        placeholderData: keepPreviousData,
    });
}