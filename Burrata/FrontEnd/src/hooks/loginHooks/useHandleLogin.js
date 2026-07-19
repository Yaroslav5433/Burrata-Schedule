import { login_admin_request } from "@/api/requests"
import { useNavigate } from "react-router-dom"
import { useLoginStore } from "./useLoginStore"

export function useHandleLogin() {

    const setErrorOnAuth = useLoginStore(state => state.setErrorOnAuth)
    const navigate = useNavigate()

    return async (form) => {
        try {
            const token = await login_admin_request(form)
            if (token) {
                navigate("/", { replace: true })
                return
            }
        } catch {
            setErrorOnAuth(true)
        }
    }
}