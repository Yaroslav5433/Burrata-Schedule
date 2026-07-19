import { useScheduleStore } from "../stores/useScheduleStore";
import { useScheduleView } from "../useScheduleView";
import { getAllFreeWorkers } from "@/utils/utils";
import { useNotification } from "@/components/ModalWindow/ModalWindow";
import { usePopupStore } from "../stores/usePopUpStore";
import { useUIStore } from "../stores/useUIStore";
import { fill_up_schedule_request } from "@/api/requests";
import { useSaveDefaultShifts } from "@/hooks/defaultShiftsMutations";
import { useParams } from "react-router-dom";
import { demandsInputValidation } from "@/utils/utils";

export function usePopupInputSubmit() {

    const { workers } = useScheduleView()
    const { department } = useParams()

    const draftSchedule = useScheduleStore(state => state.draftSchedule)
    const setDraftSchedule = useScheduleStore(state => state.setDraftSchedule)

    const { showNotification } = useNotification()

    const closePopup = usePopupStore(state => state.closePopup)
    const popup = usePopupStore(state => state.popup)

    const setLoading = useUIStore(state => state.setLoading)
    const saveDefaultShifts = useSaveDefaultShifts(department)

    return async (e, onlyShort, onlyLong, days, dates) => {

        e.preventDefault()
        if (popup === 'fillup') {
            const onlyWorkersDraftSchedule = Object.fromEntries(
                Object.keys(workers).map(name => [
                    name,
                    draftSchedule[name] ?? workers[name]
                ])
            )
            const inputIsValid = demandsInputValidation(
                days,
                getAllFreeWorkers(onlyWorkersDraftSchedule)
            )
            if (!inputIsValid.isValid) {
                showNotification(inputIsValid.message, true)
                return
            }
            const only_short = onlyShort.map(worker => worker.value)
            const only_long = onlyLong.map(worker => worker.value)
            closePopup()

            try {
                setLoading(true)
                const res = await fill_up_schedule_request(
                    onlyWorkersDraftSchedule,
                    days,
                    dates,
                    only_long,
                    only_short
                )
                setDraftSchedule(res.schedule)
            } catch (error) {
                showNotification(error.message, true)
            } finally {
                setLoading(false)
            }
        }
        if (popup === 'editallusers') {
            saveDefaultShifts.mutate(
                {
                    shifts: days,
                },
                {
                    onSuccess: () => {
                        showNotification('Default settings have been saved')
                    },
                    onError: () => {
                        showNotification('Error while saving', true)
                    }
                }
            )
        }
    }
}