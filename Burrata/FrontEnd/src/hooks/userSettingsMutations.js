import { useMutation, useQueryClient } from "@tanstack/react-query";
import { save_new_user_settings } from "@/api/requests";

export function useSaveUserSettings(userId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ totalMaxShifts, availableShiftsValues }) =>
      save_new_user_settings(
        userId,
        totalMaxShifts,
        availableShiftsValues
      ),

    onSuccess: () => {
      queryClient.invalidateQueries(["totalMax", username]);
      queryClient.invalidateQueries(["availableShifts", username]);
    },
  });
};
