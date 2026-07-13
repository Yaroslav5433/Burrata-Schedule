import React from 'react'

function CountValuesInTable(props) {

    const {
        weekDates,
        countShift
    } = props

    const NamesAndValues = [
        {name: 'Total X', value: 'X'},
        {name: 'Total 1', value: '1'},
        {name: 'Total 2', value: '2'},
        {name: 'Total Д10', value: 'Д10'},
        {name: 'Total Д12', value: 'Д12'}, 
    ]

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
)}

export default CountValuesInTable
