import { get_all_claims_request } from "../api/requests"

export async function get_all_claims_request_handler(department, dateStep) {
    try {
        const all_claims = await get_all_claims_request(department, dateStep)

        console.log('getting claims...')
        
        return all_claims

    } catch(error) {
        console.log('Failed during claims getting', error.message)
    }
}
