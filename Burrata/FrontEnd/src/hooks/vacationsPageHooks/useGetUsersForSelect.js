import { useUsers } from "../useUsers"
import { useVacations } from "./useVacations"

export function useGetUsersForSelect() {

    const vacationsQuery = useVacations()
    const usersQuery = useUsers()

    const vacations = vacationsQuery.data ?? []
    const users = usersQuery.data ?? [];

    const vacationsUsers = vacations.map(item => item.username)

    return Object.keys(users).filter(user => !vacationsUsers.includes(user))
}