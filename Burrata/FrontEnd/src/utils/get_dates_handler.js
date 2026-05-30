import { get_dates_request } from "../api/requests"

export async function get_all_users_request_handler(step = 0) {
    try {
        const week_dates = await get_dates_request(step)

        console.log('getting dates...')

        return week_dates

    } catch(error) {
        console.log('Failed during receiving dates:', error.message)
    }
}
