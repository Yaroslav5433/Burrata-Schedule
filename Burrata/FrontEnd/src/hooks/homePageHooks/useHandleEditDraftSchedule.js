import { useScheduleStore } from "./stores/useScheduleStore"
import { useScheduleView } from "./useScheduleView"

export function useHandleEditDraftSchedule() {

    const { all_workers_to_show, all_trainees_to_show } = useScheduleView()
    const setDraftSchedule = useScheduleStore(state => state.setDraftSchedule)

    return (user, dateIndex, value) => {

        const merged_to_show = {
            ...all_workers_to_show,
            ...all_trainees_to_show
        }

        const copy = structuredClone(merged_to_show)

        copy[user][dateIndex] = value

        setDraftSchedule(copy)
    }
}