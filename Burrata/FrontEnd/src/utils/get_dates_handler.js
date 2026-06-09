import { get_dates_request } from "../api/requests"

export async function get_dates_request_handler(dateStep) {
    try {
        const week_dates = await get_dates_request(dateStep)

        console.log('getting dates...')

        return week_dates

    } catch(error) {
        console.log('Failed during receiving dates:', error.message)
    }
}
