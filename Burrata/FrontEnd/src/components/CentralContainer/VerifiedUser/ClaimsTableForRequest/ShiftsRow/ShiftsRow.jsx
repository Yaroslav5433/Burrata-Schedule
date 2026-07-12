import React, { useContext } from 'react'
import styles from './ShiftsRow.module.css'
import { Context } from '@/components/Context'

function ShiftsRow(props) {

    const {
        userSavedClaims,
        claimValues,
        availableShiftsValues,
        totalMaxShifts,
        limits
    } = useContext(Context)

    const {
        handleChange,
    } = props

    console.log('limits', limits)

    const SHORT_GROUP = ["1", "2"];

    const calculateUsed = (values) => {
        return values.reduce((acc, v) => {
          if (!v) return acc;
          acc[v] = (acc[v] || 0) + 1;
          return acc;
        }, {});
      };

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
                                disabled={isDisabled || !(limits[day])}
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
            ))}
        </tr>
    )
}

export default ShiftsRow
