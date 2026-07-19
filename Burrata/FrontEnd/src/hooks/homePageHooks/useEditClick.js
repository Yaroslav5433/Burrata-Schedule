import { useScheduleStore } from "./stores/useScheduleStore"
import { useScheduleView } from "./useScheduleView"

export function useEditClick() {

    const { schedule } = useScheduleView()

    const setDraftSchedule = useScheduleStore(state => state.setDraftSchedule)
    const setCustomEdit = useScheduleStore(state => state.setCustomEdit)
    const setShowClaims = useScheduleStore(state => state.setShowClaims)
    const setIsEdit = useScheduleStore(state => state.setIsEdit)

    return (action) => {

        if (action === "edit table") {
            setDraftSchedule(structuredClone(schedule))
            setCustomEdit(false)
            setShowClaims(false)
            setIsEdit(true)
        }

        if (action === "cancel changes") {
            setIsEdit(false)
        }

        if (action === "custom edit") {
            setDraftSchedule(structuredClone(schedule))
            setShowClaims(false)
            setCustomEdit(true)
        }

        if (action === "cancel custom changes") {
            setCustomEdit(false)
        }
    }
}