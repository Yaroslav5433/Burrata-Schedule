import { useMutation } from "@tanstack/react-query";
import { save_user_claims_request } from "@/api/requests";
import { useUserStore } from "./stores/useUserStore";

export function useSaveUserClaims() {

    const setUserSavedClaims = useUserStore(state => state.setUserSavedClaims);
    const userName = useUserStore(state => state.userName);
    const userMessage = useUserStore(state => state.userMessage);

    return useMutation({

        mutationFn: ({ claims }) =>
            save_user_claims_request(
                claims,
                userName,
                userMessage
            ),

        onSuccess: (_, variables) => {
            setUserSavedClaims(
                variables.claims
            );
        }
    });
}