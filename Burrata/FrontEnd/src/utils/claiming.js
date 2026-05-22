import { ClaimingRequest } from "../api/requests"

export async function claiming(values, userName) {
    try {
        console.log(values)
        const res = await ClaimingRequest(values, userName)

        console.log('Sending a claims...')
        return res
    } catch(error) {
        console.log('ERROR', error.message)
    }
}