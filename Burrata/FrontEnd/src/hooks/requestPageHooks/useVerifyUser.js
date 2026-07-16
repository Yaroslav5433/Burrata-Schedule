import { useQueryClient } from "@tanstack/react-query";
import { verify_user_request } from "@/api/requests";
import { useUserStore } from "./stores/useUserStore";
import { useUIStore } from "./stores/useUIStore";

export function useVerifyUser() {
    const queryClient = useQueryClient();
    const setErrorOnReq = useUIStore(state => state.setErrorOnReq)
    const setVerificationPage = useUIStore(state => state.setVerificationPage)
    const setUserInfo = useUserStore(state => state.setUserInfo)

    const verifyUser = async (unique_user_id) => {
        try {
            const userAndClaimsInfo = await queryClient.fetchQuery({
                queryKey: ["user", unique_user_id],
                queryFn: () => verify_user_request(unique_user_id),
            });

            const { username, claims, message } = userAndClaimsInfo;
            setUserInfo({username, claims, message});

            setErrorOnReq(false);
            setVerificationPage(false);

        } catch (error) {
            setErrorOnReq(true);
        }
    };

    return { verifyUser };
}