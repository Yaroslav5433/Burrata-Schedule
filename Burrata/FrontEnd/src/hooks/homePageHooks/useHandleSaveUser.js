import { useRef, useEffect } from "react"
import { useParams } from "react-router-dom";
import { useUserStore } from "./stores/useUserStore";
import { generateEightDigitNumber } from "@/utils/utils";
import { useSaveUser } from "../usersMutations";

export function useHandleSaveUser() {

    const { department } = useParams()

    const addUser = useUserStore(state => state.addUser)
    const userTextName = useUserStore(state => state.userTextName)

    const saveUser = useSaveUser(department)

    const inputRef = useRef(null);

    useEffect(() => {
        if (addUser) {
            inputRef.current?.focus();
        }
    }, [addUser])

    const handleSaveUser = (is_trainee) => {

        const unique_id_number = generateEightDigitNumber()

        saveUser.mutate({
            username: userTextName,
            unique_id_number,
            is_trainee
        })
    }

    return handleSaveUser
}