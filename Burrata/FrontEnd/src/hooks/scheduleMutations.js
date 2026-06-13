import { useMutation, useQueryClient } from "@tanstack/react-query"
import { save_schedule_table_request_handler } from "@/utils/save_schedule_table_handler"


export function useSaveClaimsIntoSchedule(dateStep, department) {
  const queryClient = useQueryClient() 
  return useMutation({
    mutationFn: ({ schedule }) => 
      save_schedule_table_request_handler(schedule, dateStep),

    onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ["schedule", department, dateStep]})
    },
    onError: () => {
        console.log("Schedule hasn`t been invalidate")
    }
  })
}

