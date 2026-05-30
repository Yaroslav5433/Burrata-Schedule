import { save_user_claims_request } from "../api/requests"

export async function save_user_claims_request_handler(values, userName) {
    try {
        console.log(values)
        const res = await save_user_claims_request(values, userName)

        console.log('Saving a claims...')

        return res

    } catch(error) {
        console.log('Failed during claims saving:', error.message)
    }
}