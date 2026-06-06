import { save_users_claims_request } from "../api/requests"

export async function save_users_claims_request_handler(values) {
    try {
        console.log(values)
        const res = await save_users_claims_request(values)

        console.log('Saving a claims...')

        return res

    } catch(error) {
        console.log('Failed during claims saving:', error.message)
    }
}