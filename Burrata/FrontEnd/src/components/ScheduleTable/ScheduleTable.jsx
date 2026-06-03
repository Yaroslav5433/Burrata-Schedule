import React from 'react'
import styles from './ScheduleTable.module.css'
import { Context } from '../Context.js'
import { useContext } from 'react'

function ScheduleTable() {
    const {
        all_users_with_claims,
        weekDates,
        setAllUsers,
        allUsers,
        showClaims
   } = useContext(Context)

   const all_users_to_show = showClaims ? all_users_with_claims : allUsers

    const handleChange = (userIndex, dateIndex, value) => {
        const copy = structuredClone(all_users_to_show);
        const userKey = Object.keys(copy)[userIndex]

        copy[userKey][dateIndex] = value
    
        setAllUsers(copy)
    };

    const countShift = (dateIndex, shiftType) => {
        return Object.values(all_users_to_show).filter(
            user => user[dateIndex] === shiftType
        ).length;
    };

    console.log('claims users', all_users_to_show)
    console.log('just users', allUsers)
    console.log('users to show', all_users_to_show  )

  return (
    <table className={styles.table}>
        <tbody>
          <tr>
            <td></td>
            {weekDates.map((date, i) => (
                <td key={i}>{date}</td>
            ))}
          </tr>
    
          {Object.keys(all_users_to_show).map((user, userIndex) => (
            <tr key={userIndex}>
                <td className={styles.worker}>{user}</td>
                
                {weekDates.map((date, dateIndex) => (
                <td key={date}
                >
                    { showClaims ? 
                    <p> { Object.values(all_users_to_show)[userIndex]?.[dateIndex] } </p> : 
                    <select 
                    value={Object.values(all_users_to_show)[userIndex]?.[dateIndex]}
                    onChange={(e) => handleChange(userIndex, dateIndex, e.target.value)}>
                    <option value={undefined}>{undefined}</option>
                    <option value="X">X</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="D12">D12</option>
                    <option value="D10">D10</option>
                  </select>}
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
                {weekDates.map((_, i) => (
                    <td key={i}>
                        {countShift(i, "1")}
                    </td>
                ))}
            </tr>

            <tr>
                <td>Total 2</td>
                {weekDates.map((_, i) => (
                    <td key={i}>
                        {countShift(i, "2")}
                    </td>
                ))}
            </tr>

            <tr>
                <td>Total D10</td>
                {weekDates.map((_, i) => (
                    <td key={i}>
                        {countShift(i, "D10")}
                    </td>
                ))}
            </tr>

            <tr>
                <td>Total D12</td>
                {weekDates.map((_, i) => (
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
