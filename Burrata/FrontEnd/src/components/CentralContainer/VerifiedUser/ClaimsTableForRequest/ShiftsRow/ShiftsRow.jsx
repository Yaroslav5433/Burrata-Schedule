import React, { useContext } from 'react'
import styles from './ShiftsRow.module.css'
import { Context } from '@/components/Context'

function ShiftsRow(props) {

    const {
        claimDates,
        userSavedClaims,
        claimValues,
    } = useContext(Context)

    const {
        handleChange,
        hasANumber,
        hasTwoX
    } = props

    return (
        <tr className={styles.row}>
            {claimDates.map((_, i) => (
                <td className={styles.rowElement} key={i}>
                {!userSavedClaims.some(Boolean) ? (
                    <select
                    className={styles.select}
                    value={claimValues[i]}
                    onChange={(e) => handleChange(i, e.target.value)}
                    >
                    <option className={styles.option} value=""></option>
                    <option className={styles.option} value="X" disabled={hasTwoX}>X</option>
                    <option className={styles.option} value="1" disabled={hasANumber}>1</option>
                    <option className={styles.option} value="2" disabled={hasANumber}>2</option>
                    </select>
                ) : (
                    userSavedClaims?.[i] ?? ''
                )}
                </td>
            ))}
        </tr>
    )
}

export default ShiftsRow
