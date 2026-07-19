import { useNotification } from "@/components/ModalWindow/ModalWindow"
import { useVacationsStore } from "./stores/useVacationsStore"
import { useSaveVacation } from "../vacationsMutations"
import { useDeleteVacation } from "../vacationsMutations"

export function useHandleSaveVacations() {

    const { showNotification } = useNotification()

    const username = useVacationsStore(state => state.username)
    const dates = useVacationsStore(state => state.dates)
    const setDates = useVacationsStore(state => state.setDates)

    const setAddVacation = useVacationsStore(state => state.setAddVacation)
    const saveVacations = useSaveVacation()

    return () => {

        saveVacations.mutate(
            {
                username,
                start_date: dates[0],
                end_date: dates[1]
            },
            {
                onSuccess: () => {
                    setAddVacation(false)
                    setDates('')
                },
                onError: () => {
                    showNotification('Fill up all fields', true)
                }
            }
        )
    }
}

export function useHandleDeleteVacations() {

  const { showNotification } = useNotification()

  const deleteVacations = useDeleteVacation()

  return (current_username) => {

      deleteVacations.mutate(
          {
              username: current_username
          },
          {
              onError: () => {
                  showNotification('Something went wrong', true)
              }
          }
      )
  }
}