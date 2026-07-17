import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { get_messages } from "@/api/requests";

export function useMessage(department, enabled = true) {
    return useQuery({
        queryKey: ["messages", department],

        queryFn: () =>
            get_messages(department),

        enabled: enabled,

        placeholderData: keepPreviousData,
    });
}