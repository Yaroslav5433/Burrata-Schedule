import React from 'react'
import styles from './ShiftsRow.module.css'
import { useAvailableShifts } from '@/hooks/useAvailableShifts'
import { useUserStore } from '@/hooks/requestPageHooks/stores/useUserStore'
import ShiftSelect from '../ShiftSelect/ShiftSelect'

function ShiftsRow() {

    const userName = useUserStore(state => state.userName)

    const availableShiftsValuesQuery = useAvailableShifts(userName)
    const userSavedClaims = useUserStore(state => state.userSavedClaims)

    const availableShiftsValues = availableShiftsValuesQuery.data ?? {}

    return (
        <tr className={styles.row}>
            {Object.keys(availableShiftsValues).map((day, dayId) => (
                <td className={styles.rowElement} key={day}>
                {!userSavedClaims.some(Boolean) ? (
                    <ShiftSelect
                    day = {day}
                    dayId = {dayId}/>
                ) : 
                (userSavedClaims?.[dayId] ?? '')}
                </td>
            ))}
        </tr>
    )
}

export default ShiftsRow
