import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { get_schedule_request } from "@/api/requests";

export function useSchedule(department, dateStep, enabled = true) {
    return useQuery({
        queryKey: ["schedule", department, dateStep],

        queryFn: () =>
            get_schedule_request(department, dateStep),

        enabled: enabled,

        placeholderData: keepPreviousData,

        retry: 0
    });
}