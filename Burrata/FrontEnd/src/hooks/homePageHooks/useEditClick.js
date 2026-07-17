import { useScheduleStore } from "./stores/useScheduleStore"
import { useSchedule } from "./useSchedule"


export function useEditClick(action) {
    
    const scheduleQuery = useSchedule()
    const setDraftSchedule = useScheduleStore(state => state.setDraftSchedule)
    const setCustomEdit = useScheduleStore(state => state.setCustomEdit)
    const setShowClaims = useScheduleStore(state => state.setShowClaims)
    const setIsEdit = useScheduleStore(state => state.setIsEdit)

    if (action == "edit table") {
        setDraftSchedule(structuredClone(scheduleQuery.data))
        setCustomEdit(false)
        setShowClaims(false)
        setIsEdit(true)
      }
      if (action == "cancel changes") {
        setIsEdit(false)
      }
      if (action == "custom edit") {
        setDraftSchedule(structuredClone(scheduleQuery.data))
        setShowClaims(false)
        setCustomEdit(true)
      }
      if (action == "cancel custom changes") {
        setCustomEdit(false)
      }
}