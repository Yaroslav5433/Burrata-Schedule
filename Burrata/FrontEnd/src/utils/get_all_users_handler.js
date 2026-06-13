import { get_all_users_request } from "@/api/requests"

export async function get_all_users_request_handler(department) {
    try {
        const all_users = await get_all_users_request(department)

        console.log('getting users...')

        return all_users

    } catch(error) {
        console.log('Failed during receiving all users:', error.message)
    }
}
