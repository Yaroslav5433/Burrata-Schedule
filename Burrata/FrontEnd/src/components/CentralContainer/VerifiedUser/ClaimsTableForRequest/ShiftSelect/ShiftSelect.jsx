import React from 'react'
import { useLimits } from '@/hooks/requestPageHooks/useLimits'
import { useTotalMaxShifts } from '@/hooks/useTotalMaxShifts'
import { useAvailableShifts } from '@/hooks/useAvailableShifts'
import { useUserStore } from '@/hooks/requestPageHooks/stores/useUserStore'
import { useClaimStore } from '@/hooks/requestPageHooks/stores/useClaimStore'
import styles from './ShiftSelect.module.css'

function ShiftSelect(props) {

    const {
        day,
        dayId
    } = props

    const userName = useUserStore(state => state.userName)

    const limitsQuery = useLimits(userName)
    const totalMaxShiftsQuery = useTotalMaxShifts(userName)
    const availableShiftsValuesQuery = useAvailableShifts(userName)
    const claimValues = useClaimStore(state => state.claimValues)

    const limits = limitsQuery.data ?? {}
    const totalMaxShifts = totalMaxShiftsQuery.data ?? {}
    const availableShiftsValues = availableShiftsValuesQuery.data ?? {}

    const updateClaimValues = useClaimStore(state => state.updateClaimValues)
    
    const SHORT_GROUP = ["1", "2"];

    const calculateUsed = (values) =>
        values.reduce((acc, v) => {
            if (!v) return acc;
            acc[v] = (acc[v] || 0) + 1;
            return acc;
        }, {});

    const used = calculateUsed(claimValues);

    const shortUsed = SHORT_GROUP.reduce(
        (sum, k) => sum + (used[k] || 0),
        0
    );

    return (
        <select
            value={claimValues[dayId]}
            onChange={(e) => updateClaimValues(dayId, e.target.value)}
            className={ styles.select }
        >
            <option value=""></option>

            {Object.entries(availableShiftsValues[day])
                .filter(([, value]) => value)
                .map(([key]) => {
                    const isShort = SHORT_GROUP.includes(key);

                    const disabled =
                        isShort
                            ? shortUsed >= totalMaxShifts.short
                            : used[key] >= totalMaxShifts[key];

                    return (
                        <option
                            key={key}
                            value={key}
                            disabled={disabled || (limits && !limits[day])}
                        >
                            {key}
                        </option>
                    );
                })}
        </select>
    );
}

export default ShiftSelect
