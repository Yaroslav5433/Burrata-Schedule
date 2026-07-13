import { useMutation, useQueryClient } from "@tanstack/react-query";
import { save_default_shifts } from "@/api/requests";

export function useSaveDefaultShifts() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ shifts }) =>
      save_default_shifts(
        shifts
      ),

    onSuccess: () => {
      queryClient.invalidateQueries(["defaultShifts"]);
    },
  });
};
