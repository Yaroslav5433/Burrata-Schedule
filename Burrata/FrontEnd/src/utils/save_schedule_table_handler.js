import { save_schedule_table_request } from "@/api/requests"

export async function save_schedule_table_request_handler(schedule, dateStep) {
    try {
        const res = await save_schedule_table_request(schedule, dateStep)

        console.log('Saving a schedule...')

        return res

    } catch(error) {
        console.log('Failed during schedule saving:', error.message)
    }
}