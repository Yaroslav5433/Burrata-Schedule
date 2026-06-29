import React, { useContext } from 'react'
import styles from './ClaimsTableMobile.module.css'
import { Context } from '@/components/Context'

function ClaimsTableMobile(props) {

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
        <table className={styles.table}>
            <tbody className={styles.body}>
            {claimDates.map((date, i) => (
                <tr className={styles.rowElement} key={i}>
                <td className={styles.rowElement}>{date}</td>
                <td className={styles.rowElement}>
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
                </tr>
            ))}
            </tbody>
        </table>
    )
}

export default ClaimsTableMobile
