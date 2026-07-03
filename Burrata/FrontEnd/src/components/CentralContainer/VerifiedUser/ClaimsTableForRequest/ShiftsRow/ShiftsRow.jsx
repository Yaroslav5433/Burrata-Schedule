import React, { useContext } from 'react'
import styles from './ShiftsRow.module.css'
import { Context } from '@/components/Context'

function ShiftsRow(props) {

    const {
        userSavedClaims,
        claimValues,
        availableShiftsValues,
        totalMaxShifts,
        used
    } = useContext(Context)

    const {
        handleChange,
    } = props

    return (
        <tr className={styles.row}>
            {Object.keys(availableShiftsValues).map((day, dayId) => (
                <td className={styles.rowElement} key={day}>
                {!userSavedClaims.some(Boolean) ? (
                    <select
                    className={styles.select}
                    value={claimValues[dayId]}
                    onChange={(e) => handleChange(dayId, e.target.value)}
                    >
                        <option className={styles.option} value={undefined}></option>
                        {Object.entries(availableShiftsValues[day])
                        .filter(([, value]) => value)
                        .map(([key]) => (
                            <option 
                            className={styles.option}
                            value={key}
                            disabled={used[key] >= (totalMaxShifts?.[key] ?? 0)}>{key}</option>
                    ))}
                    </select>
                ) : (
                    userSavedClaims?.[dayId] ?? ''
                )}
                </td>
            ))}
        </tr>
    )
}

export default ShiftsRow
