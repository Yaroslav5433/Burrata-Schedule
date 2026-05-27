import React from 'react'
import styles from './ScheduleTable.module.css'
import { Context } from '../Context.js'
import { useContext, useState } from 'react'

function ScheduleTable() {
    const {
        allUsers,
        thisWeekDates,
        shiftValues,
        setShiftValues
   } = useContext(Context)

   const handleChange = (userIndex, dateIndex, value) => {
    const copy = [...shiftValues];
    copy[userIndex][dateIndex] = value;
    setShiftValues(copy)
    };

    const countShift = (dateIndex, shiftType) => {
        return shiftValues.filter(
            user => user[dateIndex] === shiftType
        ).length;
    };

  return (
    <table className={styles.table}>
        <tbody>
          <tr>
            <td></td>
            {thisWeekDates.map((date, i) => (
                <td key={i}>{date}</td>
            ))}
          </tr>
    
          {allUsers.map((user, userIndex) => (
            <tr key={userIndex}>
                <td>{user}</td>
                
                {thisWeekDates.map((date, dateIndex) => (
                <td key={date}>
                    <select 
                    value={shiftValues[userIndex]?.[dateIndex]}
                    onChange={(e) => handleChange(userIndex, dateIndex, e.target.value)}>
                    <option value={undefined}>{undefined}</option>
                    <option value="X">X</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="D12">D12</option>
                    <option value="D10">D10</option>
                  </select>
                </td>
                ))}
            </tr>
            ))}

            <tr>
                <td></td>
                {Array(7).fill(undefined).map((_, j) => (
                <td key={j}></td>
                ))}
            </tr>

            <tr>
                <td>Total 1</td>
                {thisWeekDates.map((_, i) => (
                    <td key={i}>
                        {countShift(i, "1")}
                    </td>
                ))}
            </tr>

            <tr>
                <td>Total 2</td>
                {thisWeekDates.map((_, i) => (
                    <td key={i}>
                        {countShift(i, "2")}
                    </td>
                ))}
            </tr>

            <tr>
                <td>Total D10</td>
                {thisWeekDates.map((_, i) => (
                    <td key={i}>
                        {countShift(i, "D10")}
                    </td>
                ))}
            </tr>

            <tr>
                <td>Total D12</td>
                {thisWeekDates.map((_, i) => (
                    <td key={i}>
                        {countShift(i, "D12")}
                    </td>
                ))}

            </tr>
        </tbody>
      </table>
  )
}

export default ScheduleTable
