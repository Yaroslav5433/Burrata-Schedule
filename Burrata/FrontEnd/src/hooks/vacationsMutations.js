import { useMutation, useQueryClient } from "@tanstack/react-query";
import { delete_vacation, save_vacation } from "@/api/requests";

export function useSaveVacation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, startDate, endDate }) =>
      save_vacation(
        userId,
        startDate,
        endDate
      ),

    onSuccess: () => {
      queryClient.invalidateQueries(["vacations"]);
    },

    onError: () => {
      console.log('Vacations haven`t been invalidated')
    }
  });
};


export function useDeleteVacation() {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: ({ username }) =>
        delete_vacation(username),
  
      onSuccess: () => {
        queryClient.invalidateQueries(["vacation"]);
      },
      onError: () => {
        console.log("Vacations haven`t been invalidated");  
    }
    });
  };