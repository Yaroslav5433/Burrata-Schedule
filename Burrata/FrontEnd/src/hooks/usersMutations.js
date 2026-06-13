import { useMutation, useQueryClient } from "@tanstack/react-query";
import { save_new_worker_request_handler } from "@/utils/save_new_worker_handler";
import { delete_user_request_handler } from "@/utils/delete_user_handler";

export function useSaveUser(department) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ username, unique_id_number, is_trainee }) =>
      save_new_worker_request_handler(
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
        delete_user_request_handler(current_username),
  
      onSuccess: () => {
        queryClient.invalidateQueries(["users", department]);
      },
      onError: () => {
        console.log("Users haven`t been invalidated");
    }
    });
  };