import React from 'react'
import styles from './ScheduleTable.module.css'
import { Context } from '../Context.js'
import { useContext, useState } from 'react'

function ScheduleTable() {
    const {
        allUsers,
        thisWeekDates
   } = useContext(Context)

   const [totalFirst, setTotalFirst] = useState({})
   const [totalSecond, setTotalSecond] = useState({})
   const [totalLongTen, setTotalLongTen] = useState({})
   const [totalLongTwelfe, setTotalLongTwelfe] = useState({})

  return (
    <table className={styles.table}>
        <tbody>
          <tr>
            <td></td>
            {thisWeekDates.map((date, i) => (
                <td key={i}>{date}</td>
            ))}
          </tr>
    
          {allUsers.map((user, i) => (
            <tr key={i}>
                <td>{user}</td>
                
                {Array(7).fill(undefined).map((_, j) => (
                <td key={j}>
                    <select>
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
                {Array(7).fill(undefined).map((_, j) => (
                <td key={j}></td>
                ))}
            </tr>

            <tr>
                <td>Total 2</td>
                {Array(7).fill(undefined).map((_, j) => (
                <td key={j}></td>
                ))}
            </tr>

            <tr>
                <td>Total D10</td>
                {Array(7).fill(undefined).map((_, j) => (
                <td key={j}></td>
                ))}
            </tr>

            <tr>
                <td>Total D12</td>
                {Array(7).fill(undefined).map((_, j) => (
                <td key={j}></td>
                ))}
            </tr>
        </tbody>
      </table>
  )
}

export default ScheduleTable
