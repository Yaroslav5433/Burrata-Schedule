import { useMutation, useQueryClient } from "@tanstack/react-query";
import { check_message_as_read } from "@/api/requests";

export function useCheckAsRead() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({id}) => 
            check_message_as_read(id),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["messages"]})},
        onError: () => {
            console.log('message hasn`t been checked')
        }
    })
}