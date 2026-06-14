import { useMutation, useQueryClient } from "@tanstack/react-query";
import { save_new_worker_request } from "@/api/requests";
import { delete_user_request } from "@/api/requests";

export function useSaveUser(department) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ username, unique_id_number, is_trainee }) =>
      save_new_worker_request(
        username,
        department,
        unique_id_number,
        is_trainee
      ),

    onSuccess: () => {
      queryClient.invalidateQueries(["users", department]);
    },
  });
};


export function useDeleteUser(department) {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: ({ current_username }) =>
        delete_user_request(current_username),
  
      onSuccess: () => {
        queryClient.invalidateQueries(["users", department]);
      },
      onError: () => {
        console.log("Users haven`t been invalidated");
    }
    });
  };