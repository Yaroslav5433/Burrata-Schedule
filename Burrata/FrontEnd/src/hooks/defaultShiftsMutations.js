import { useMutation, useQueryClient } from "@tanstack/react-query";
import { save_default_shifts } from "@/api/requests";

export function useSaveDefaultShifts(department) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ shifts }) =>
      save_default_shifts(
        shifts,
        department
      ),

    onSuccess: () => {
      queryClient.invalidateQueries(["defaultShifts"], department);
    },
  });
};
