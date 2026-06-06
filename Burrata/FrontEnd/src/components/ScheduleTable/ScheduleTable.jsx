import React from 'react'
import styles from './ScheduleTable.module.css'
import { Context } from '../Context.js'
import { useContext, useState, useRef } from 'react'
import TextField from '../TextField/TextField.jsx'

function ScheduleTable() {
    const {
        all_users_with_claims,
        weekDates,
        setSchedule,
        all_users_shifts,
        showClaims,
        schedule
   } = useContext(Context)

   const [addUser, setAddUser] = useState(false)
   const [addTrainee, setAddTrainee] = useState(false)
   const [userTextName, setUserTextName] = useState('')
   const [traineeTextName, setTraineeTextName] = useState('')

   const inputRef = useRef();

   const all_users_to_show = showClaims ? all_users_with_claims : all_users_shifts

    const handleChange = (userIndex, dateIndex, value) => {
        const copy = structuredClone(all_users_to_show);
        const userKey = Object.keys(copy)[userIndex]

        copy[userKey][dateIndex] = value
    
        setSchedule(copy)
    };

    const handleRequest = async () => {

    }

    const handleClick = async (icon) => {
        if (icon === "plus") {
            setAddUser(true)
        }
        if (icon === "plus_trainee") {
            setAddTrainee(true)
        }
    }

    const countShift = (dateIndex, shiftType) => {
        return Object.values(all_users_to_show).filter(
            user => user[dateIndex] === shiftType
        ).length;
    };

    console.log('claims users', all_users_to_show)
    console.log('just users', all_users_shifts)
    console.log('users to show', all_users_to_show)
    console.log('schedule', schedule)

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
                <td>
                    <div className={styles.workerContainer}>
                        <button onClick={handleClick} className={styles.workerContainerButton}>
                            <svg className = {styles.icon} viewBox="0 0 50 50"> 
                                <path d="M 25 2 C 12.309295 2 2 12.309295 2 25 C 2 37.690705 12.309295 48 25 48 C 37.690705 48 48 37.690705 48 25 C 48 12.309295 37.690705 2 25 2 z M 25 4 C 36.609824 4 46 13.390176 46 25 C 46 36.609824 36.609824 46 25 46 C 13.390176 46 4 36.609824 4 25 C 4 13.390176 13.390176 4 25 4 z M 25 11 A 3 3 0 0 0 22 14 A 3 3 0 0 0 25 17 A 3 3 0 0 0 28 14 A 3 3 0 0 0 25 11 z M 21 21 L 21 23 L 22 23 L 23 23 L 23 36 L 22 36 L 21 36 L 21 38 L 22 38 L 23 38 L 27 38 L 28 38 L 29 38 L 29 36 L 28 36 L 27 36 L 27 21 L 26 21 L 22 21 L 21 21 z"/>
                            </svg>
                        </button>
                        {user}
                        <button onClick={handleClick} className={styles.workerContainerButton}>
                            <svg className = {styles.icon} viewBox="0 0 50 50"> 
                                <path d="M 25 2 C 12.309295 2 2 12.309295 2 25 C 2 37.690705 12.309295 48 25 48 C 37.690705 48 48 37.690705 48 25 C 48 12.309295 37.690705 2 25 2 z M 25 4 C 36.609824 4 46 13.390176 46 25 C 46 36.609824 36.609824 46 25 46 C 13.390176 46 4 36.609824 4 25 C 4 13.390176 13.390176 4 25 4 z M 13 24 L 37 24 L 37 26 L 13 26 Z"/>
                            </svg>
                        </button>
                    </div>
                </td>
                
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
                {addUser ?
                <td>
                    <div className={styles.userTextContainer}>
                        <TextField 
                            value = {userTextName} 
                            tableStyle = {styles.userText}
                            onBlur = {() => {
                                setAddUser(false)
                                setUserTextName('')
                            }}
                            onChange = {(e) => setUserTextName(e.target.value)}
                            onKeyDown = {(e) => {
                                if (e.key === "Enter") {
                                    handleRequest()
                                }
                            }}/>
                    </div>
                </td> :
                <td className={styles.iconWrapper}>
                    <button onClick={() => handleClick("plus")} className={styles.plusButton}>
                       <svg className = {styles.icon} viewBox="0 0 50 50"> 
                            <path d="M 25 2 C 12.309295 2 2 12.309295 2 25 C 2 37.690705 12.309295 48 25 48 C 37.690705 48 48 37.690705 48 25 C 48 12.309295 37.690705 2 25 2 z M 25 4 C 36.609824 4 46 13.390176 46 25 C 46 36.609824 36.609824 46 25 46 C 13.390176 46 4 36.609824 4 25 C 4 13.390176 13.390176 4 25 4 z M 24 13 L 24 24 L 13 24 L 13 26 L 24 26 L 24 37 L 26 37 L 26 26 L 37 26 L 37 24 L 26 24 L 26 13 L 24 13 z"/>
                        </svg>
                    </button>
                </td> }
                {Array(7).fill(undefined).map((_, j) => (
                <td key={j}></td>
                ))}
            </tr>

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

            <tr>
                <td></td>
                {Array(7).fill(undefined).map((_, j) => (
                <td key={j}></td>
                ))}
            </tr>

            <tr>
                {addTrainee ?
                <td>
                    <div className={styles.userTextContainer}>
                        <TextField 
                            value = {traineeTextName} 
                            tableStyle = {styles.userText}
                            onBlur = {() => {
                                setAddTrainee(false)
                                setTraineeTextName('')
                            }}
                            onChange = {(e) => setTraineeTextName(e.target.value)}
                            onKeyDown = {(e) => {
                                if (e.key === "Enter") {
                                    handleRequest()
                                }
                            }}/>
                    </div>
                </td> :
                <td className={styles.iconWrapper}>
                    <button onClick={() => handleClick("plus_trainee")} className={styles.plusButton}>
                       <svg className = {styles.icon} viewBox="0 0 50 50"> 
                            <path d="M 25 2 C 12.309295 2 2 12.309295 2 25 C 2 37.690705 12.309295 48 25 48 C 37.690705 48 48 37.690705 48 25 C 48 12.309295 37.690705 2 25 2 z M 25 4 C 36.609824 4 46 13.390176 46 25 C 46 36.609824 36.609824 46 25 46 C 13.390176 46 4 36.609824 4 25 C 4 13.390176 13.390176 4 25 4 z M 24 13 L 24 24 L 13 24 L 13 26 L 24 26 L 24 37 L 26 37 L 26 26 L 37 26 L 37 24 L 26 24 L 26 13 L 24 13 z"/>
                        </svg>
                    </button>
                </td> }
                {Array(7).fill(undefined).map((_, j) => (
                <td key={j}></td>
                ))}
            </tr>

        </tbody>
      </table>
  )
}

export default ScheduleTable
