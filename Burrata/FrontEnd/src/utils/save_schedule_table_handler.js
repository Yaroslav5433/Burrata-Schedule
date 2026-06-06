import { save_schedule_table_request } from "../api/requests"

export async function save_schedule_table_request_handler(schedule) {
    try {
        const res = await save_schedule_table_request(schedule)

        console.log('Saving a schedule...')

        return res

    } catch(error) {
        console.log('Failed during schedule saving:', error.message)
    }
}