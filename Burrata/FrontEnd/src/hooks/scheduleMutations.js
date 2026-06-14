import { useMutation, useQueryClient } from "@tanstack/react-query"
import { save_schedule_table_request } from "@/api/requests";


export function useSaveIntoSchedule(dateStep, department) {
  const queryClient = useQueryClient() 
  return useMutation({
    mutationFn: ({ schedule }) => 
      save_schedule_table_request(schedule, dateStep),

    onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ["schedule", department, dateStep]});
    },
    onError: () => {
        console.log("Schedule hasn`t been invalidate");
    }
  })
}


export function useSetSchedule(dateStep, department) {
  const queryClient = useQueryClient() 
  return useMutation({
    mutationFn: ({ schedule }) => queryClient.setQueryData(
      ["schedule", department, dateStep], schedule),

    onSuccess: () => {
        console.log("Schedule has been updated")
    },
    onError: () => {
        console.log("Schedule hasn`t been updated");
    }
  })
}