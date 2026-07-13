import { useMutation, useQueryClient } from "@tanstack/react-query";
import { save_new_worker_request } from "@/api/requests";
import { delete_user_request } from "@/api/requests";

export function useSaveUser(department) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ username, uniqueIdNumber, isTrainee }) =>
      save_new_worker_request(
        username,
        department,
        uniqueIdNumber,
        isTrainee
      ),

    onSuccess: () => {
      queryClient.invalidateQueries(["users", department]);
    },
  });
};


export function useDeleteUser(department) {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: ({ current_user_id }) =>
        delete_user_request(current_user_id),
  
      onSuccess: () => {
        queryClient.invalidateQueries(["users", department]);
      },
      onError: () => {
        console.log("Users haven`t been invalidated");  
    }
    });
  };