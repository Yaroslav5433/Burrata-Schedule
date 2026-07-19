import { useSaveUserSettings } from "@/hooks/userSettingsMutations";
import { useUserStore } from "../stores/useUserStore";
import { useNotification } from "@/components/ModalWindow/ModalWindow";
import { usePopupStore } from "../stores/usePopUpStore";

export function usePopupEditSubmit() {

    const userTextName = useUserStore(state => state.userTextName)
    const saveUserSettings = useSaveUserSettings(userTextName)
    const { showNotification } = useNotification()
    const closePopup = usePopupStore(state => state.closePopup)

    return (e, totalMaxShiftDraft, availableShiftsValuesDraft) => {
        e.preventDefault()
        saveUserSettings.mutate(
            {
                totalMaxShifts: totalMaxShiftDraft,
                availableShiftsValues: availableShiftsValuesDraft
            },
            {
                onSuccess: () => {
                    showNotification('Settings have been saved')
                    closePopup()
                },
                onError: () => {
                    showNotification('Error while saving', true)
                }
            }
        )
    }
}