import { get_all_users_request } from "../api/requests"

export async function get_all_users() {
    try {
        const all_users_and_dates = await get_all_users_request()

        console.log('getting users...')
        return all_users_and_dates
    } catch(error) {
        console.log('ERROR', error.message)
    }
}
