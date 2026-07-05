import { useMutation, useQueryClient } from "@tanstack/react-query";
import { save_new_user_settings } from "@/api/requests";

export function useSaveUserSettings(username) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ totalMaxShifts, availableShiftsValues }) =>
      save_new_user_settings(
        username,
        totalMaxShifts,
        availableShiftsValues
      ),

    onSuccess: () => {
      queryClient.invalidateQueries(["totalMax", username]);
      queryClient.invalidateQueries(["availableShifts", username]);
    },
  });
};
