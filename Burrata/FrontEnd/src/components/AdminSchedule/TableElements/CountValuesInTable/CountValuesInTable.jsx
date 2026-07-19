import { useScheduleStore } from '@/hooks/homePageHooks/stores/useScheduleStore';
import { useScheduleView } from '@/hooks/homePageHooks/useScheduleView';
import { useDates } from '@/hooks/useDates';
import React from 'react'

function CountValuesInTable() {

    const dateStep = useScheduleStore(state => state.dateStep)
    const weekDatesQuery = useDates(dateStep)
    const weekDates = weekDatesQuery.data?.dates ?? []

    const NamesAndValues = [
        {name: 'Total X', value: 'X'},
        {name: 'Total 1', value: '1'},
        {name: 'Total 2', value: '2'},
        {name: 'Total Д10', value: 'Д10'},
        {name: 'Total Д12', value: 'Д12'}, 
    ]

    const { all_workers_to_show } = useScheduleView()

    const countShift = (dateIndex, shiftType) => {
        return Object.values(all_workers_to_show).filter(
            user => user?.[dateIndex] === shiftType
        ).length;
    };

    return (
        NamesAndValues.map(name => (
            <tr key = {name.value}>
                <td>{name.name}</td>
                {weekDates?.map((_, i) => (
                    <td key={i}>
                        {countShift(i, name.value)}
                    </td>
                ))}
            </tr>
        ))
    )
}

export default CountValuesInTable
