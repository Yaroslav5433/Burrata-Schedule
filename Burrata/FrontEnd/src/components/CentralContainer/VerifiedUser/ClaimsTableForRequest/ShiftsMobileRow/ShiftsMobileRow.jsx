import React from 'react'
import styles from './ShiftsMobileRow.module.css'
import ShiftSelect from '../ShiftSelect/ShiftSelect'
import { useUserStore } from '@/hooks/requestPageHooks/stores/useUserStore'
import { useAvailableShifts } from '@/hooks/useAvailableShifts'

function ShiftsMobileRow(props) {

    const userSavedClaims = useUserStore(state => state.userSavedClaims)

    const {
        date,
        day,
        dateId,
    } = props

    return (
            <tr className={styles.rowElement} key={dateId}>
                <td className={styles.rowElement}>{date}</td>
                <td className={styles.rowElement}>
                    {!userSavedClaims.some(Boolean) ? (
                   <ShiftSelect
                   day = {day}
                   dayId = {dateId}/>
                    ) : (
                    userSavedClaims?.[dateId] ?? ''
                    )}
                </td>
            </tr>
    )
}

export default ShiftsMobileRow
