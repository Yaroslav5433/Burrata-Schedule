import React, { useContext } from 'react'
import styles from './ClaimsTableMobile.module.css'
import { Context } from '@/components/Context'

function ClaimsTableMobile(props) {

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
        <table className={styles.table}>
            <tbody className={styles.body}>
            {Object.keys(availableShiftsValues).map((day, dayId) => (
                <tr className={styles.rowElement} key={dayId}>
                <td className={styles.rowElement}>{day}</td>
                <td className={styles.rowElement}>
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
                </tr>
            ))}
            </tbody>
        </table>
    )
}

export default ClaimsTableMobile
