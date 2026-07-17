import { useUIStore } from "../requestPageHooks/stores/useUIStore"
import { useNotification } from "@/components/ModalWindow/ModalWindow";
import { useSaveIntoSchedule } from "../scheduleMutations";
import { useParams } from "react-router-dom";
import { useScheduleStore } from "./stores/useScheduleStore";

const { showNotification } = useNotification();

const department = useParams();

const dateStep = useScheduleStore(state => state.dateStep)
const setLoading = useUIStore(state => state.setLoading)
const setShowClaims = useScheduleStore(state => state.setShowClaims)
const setIsEdit = useScheduleStore(state => state.setIsEdit)
const setCustomEdit = useScheduleStore(state => state.setCustomEdit)
const draftSchedule = useScheduleStore(state => state.draftSchedule)

const saveIntoSchedule = useSaveIntoSchedule(dateStep, department)

export function useSaveClaims() {
    setLoading(true)
    saveIntoSchedule.mutate({
      schedule: usersWithClaims
    }, {
      onSuccess: () => {
        showNotification('Claims have been saved')
        setShowClaims(false)
      },
      onError: () => {
        showNotification('Error while saving', true)
      },
      onSettled: () => {
        setLoading(false)
    }})
}

export function useSaveSchedule() {
    setLoading(true)

    saveIntoSchedule.mutate({
      schedule: draftSchedule
    }, {
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
    }})
}