import { get_schedule_request } from "../api/requests"

export async function get_schedule_request_handler(department, dateStep) {
    try {
        const schedule = await get_schedule_request(department, dateStep)

        console.log('getting schedule...')
        
        return schedule

    } catch(error) {
        console.log('Failed during schedule getting', error.message)
    }
}
