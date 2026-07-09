import React, { useContext } from 'react'
import styles from './ClaimsTableMobile.module.css'
import { Context } from '@/components/Context'

function ClaimsTableMobile(props) {

    const {
        userSavedClaims,
        claimValues,
        availableShiftsValues,
        totalMaxShifts,
      } = useContext(Context)

    const {
        handleChange,
    } = props

    const SHORT_GROUP = ["1", "2"];

    const calculateUsed = (values) => {
        return values.reduce((acc, v) => {
          if (!v) return acc;
          acc[v] = (acc[v] || 0) + 1;
          return acc;
        }, {});
      };

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
                        .map(([key]) => {

                            const used = calculateUsed(claimValues);

                            const shortUsed = SHORT_GROUP.reduce(
                            (sum, k) => sum + (used[k] || 0),
                            0
                            );

                            const shortMax = totalMaxShifts?.short ?? 0;

                            const isShort = SHORT_GROUP.includes(key);

                            const isDisabled =
                            isShort
                                ? shortUsed >= shortMax
                                : used[key] >= (totalMaxShifts?.[key] ?? 0);

                            return (
                            <option
                                key={key}
                                className={styles.option}
                                value={key}
                                disabled={isDisabled}
                            >
                                {key}
                            </option>
                            );
                        })}
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
