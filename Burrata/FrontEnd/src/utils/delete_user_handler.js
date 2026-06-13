import { delete_user_request } from "@/api/requests"

export async function delete_user_request_handler(username) {
    try {
        const res = await delete_user_request(username)

        console.log('Deleting user...')

        return res

    } catch(error) {
        console.log('Failed during user saving:', error.message)
    }
}