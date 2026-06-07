import { save_new_worker_request } from "../api/requests"

export async function save_new_worker_request_handler(userTextName, department, unique_id_number, is_trainee) {
    try {
        const res = await save_new_worker_request(userTextName, department, unique_id_number, is_trainee)

        console.log('Saving user...')

        return res

    } catch(error) {
        console.log('Failed during user saving:', error.message)
    }
}