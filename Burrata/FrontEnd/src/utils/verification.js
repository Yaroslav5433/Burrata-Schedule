import { VerificationRequest } from "../api/requests";

export async function verification(unique_id_number) {
    try {
        const userData = await VerificationRequest(unique_id_number)

        console.log('Verifying...')
        return userData
    } catch(error) {
        console.log('ERROR', error.message)
    }
}