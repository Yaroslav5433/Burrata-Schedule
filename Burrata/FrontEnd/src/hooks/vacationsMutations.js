import { useMutation, useQueryClient } from "@tanstack/react-query";
import { delete_vacation, save_vacation } from "@/api/requests";

export function useSaveVacation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ username, start_date, end_date }) =>
      save_vacation(
        username,
        start_date,
        end_date
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