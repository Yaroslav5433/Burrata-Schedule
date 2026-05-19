import { VerificationRequest } from "../api/requests";

export async function verification(unique_id_number) {
    try {
        const user = await VerificationRequest(unique_id_number)

        console.log('Verifying...')
        return user
    } catch(error) {
        console.log('ERROR', error.message)
    }
}