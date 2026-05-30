import { verify_user_request } from "../api/requests";

export async function verify_user_request_handler(unique_id_number) {
    try {
        const userData = await verify_user_request(unique_id_number)

        console.log('Verifying...')
        return userData

    } catch(error) {
        console.log('Failed during verification:', error.message)
    }
}