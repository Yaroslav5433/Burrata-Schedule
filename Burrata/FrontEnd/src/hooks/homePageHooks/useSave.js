import { useUIStore } from "./stores/useUIStore";
import { useNotification } from "@/components/ModalWindow/ModalWindow";
import { useSaveIntoSchedule } from "../scheduleMutations";
import { useParams } from "react-router-dom";
import { useScheduleStore } from "./stores/useScheduleStore";
import { useScheduleView } from "./useScheduleView";

export function useSaveClaims(isVacations) {

    const dateStep = useScheduleStore(state => state.dateStep)
    const { showNotification } = useNotification()

    const { department } = useParams()
    const saveIntoSchedule = useSaveIntoSchedule(dateStep, department)

    const setShowClaims = useScheduleStore(state => state.setShowClaims)
    const setLoading = useUIStore(state => state.setLoading)

    const { usersWithClaims, usersWithVacations } = useScheduleView()

    return () => {

        setLoading(true)

        saveIntoSchedule.mutate(
            {
                schedule: isVacations ? usersWithVacations : usersWithClaims
            },
            {
                onSuccess: () => {
                    showNotification(isVacations ? 'Claims have been saved' : 'Vacations have been saved')
                    setShowClaims(false)
                },
                onError: () => {
                    showNotification('Error while saving', true)
                },
                onSettled: () => {
                    setLoading(false)
                }
            }
        )
    }
}

export function useSaveSchedule() {

  const dateStep = useScheduleStore(state => state.dateStep)
  const draftSchedule = useScheduleStore(state => state.draftSchedule)

  const { showNotification } = useNotification()

  const { department } = useParams()
  const saveIntoSchedule = useSaveIntoSchedule(dateStep, department)

  const setCustomEdit = useScheduleStore(state => state.setCustomEdit)
  const setIsEdit = useScheduleStore(state => state.setIsEdit)

  const setLoading = useUIStore(state => state.setLoading)

  return () => {

      setLoading(true)

      saveIntoSchedule.mutate(
          {
              schedule: draftSchedule
          },
          {
              onSuccess: () => {
                  showNotification('Schedule has been saved')
                  setIsEdit(false)
                  setCustomEdit(false)
              },
              onError: () => {
                  showNotification('Error while saving', true)
              },
              onSettled: () => {
                  setLoading(false)
              }
          }
      )
  }
}