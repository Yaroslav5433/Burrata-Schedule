import { useParams } from "react-router-dom"
import { useUserStore } from "./stores/useUserStore"
import { useDeleteUser } from "../usersMutations"
import { usePopupStore } from "./stores/usePopUpStore"

export function useHandleSVGClick() {

    const { department } = useParams()

    const setAddUser = useUserStore(state => state.setAddUser)
    const deleteUser = useDeleteUser(department)
    const openPopup = usePopupStore(state => state.openPopup)
    const setUserTextName = useUserStore(state => state.setUserTextName)

    return (icon, current_username) => {

        if (icon === "plus") {
            setAddUser({
                state: true,
                is_trainee: false
            })
        }

        if (icon === "plus_trainee") {
            setAddUser({
                state: true,
                is_trainee: true
            })
        }

        if (icon === "minus") {
            deleteUser.mutate({
                current_username
            })
        }

        if (icon === "edit") {
            console.log('opapa')
            openPopup("edituser")
            setUserTextName(current_username)
        }
    }
}