import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { get_schedule_request } from "@/api/requests";

export function useSchedule(department, datestep, enabled = true) {
    return useQuery({
        queryKey: ["schedule", department],

        queryFn: () =>
            get_schedule_request(department, datestep),

        enabled: enabled,

        placeholderData: keepPreviousData,
    });
}