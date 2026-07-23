import { useScheduleStore } from '@/hooks/homePageHooks/stores/useScheduleStore';
import { useScheduleView } from '@/hooks/homePageHooks/useScheduleView';
import { useDates } from '@/hooks/useDates';
import EmptyRowInTable from '../EmptyRowInTable/EmptyRowInTable';
import React from 'react';

function CountValuesInTable() {

    const dateStep = useScheduleStore(state => state.dateStep);
    const weekDatesQuery = useDates(dateStep);
    const weekDates = weekDatesQuery.data?.dates ?? [];

    const NamesAndValues = [
        {name: 'Total X', value: 'X'},
        {name: 'Total 1', value: '1'},
        {name: 'Total 2', value: '2'},
        {name: 'Total Д10', value: 'Д10'},
        {name: 'Total Д12', value: 'Д12'}, 
    ];

    const { all_workers_to_show } = useScheduleView();

    const countShift = (dateIndex, shiftType) => {
        return Object.values(all_workers_to_show).filter(
            user => user?.[dateIndex] === shiftType
        ).length;
    };

    // Новый подсчёт групп смен
    const countShiftGroup = (dateIndex, shifts) => {
        return Object.values(all_workers_to_show).filter(
            user => shifts.includes(user?.[dateIndex])
        ).length;
    };

    const firstShiftTypes = ['1', 'Д', 'Д12'];
    const secondShiftTypes = ['2', 'Д', 'Д12'];

    return (
        <>
            <tr>
                <td>Total</td>

                {weekDates.map((_, i) => (
                    <td key={i}>
                        {countShiftGroup(i, firstShiftTypes)}
                        /
                        {countShiftGroup(i, secondShiftTypes)}
                    </td>
                ))}
            </tr>

            <EmptyRowInTable/>

            {NamesAndValues.map(name => (
                <tr key={name.value}>
                    <td>{name.name}</td>

                    {weekDates.map((_, i) => (
                        <td key={i}>
                            {countShift(i, name.value)}
                        </td>
                    ))}
                </tr>
            ))}
        </>
    );
}

export default CountValuesInTable;