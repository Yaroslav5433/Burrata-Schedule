import React, { useEffect, useContext, useState, useRef } from 'react'
import styles from './ScheduleTable.module.css'
import { Context } from '../Context.js'
import TextField from '../TextField/TextField.jsx'
import { save_new_worker_request_handler } from '../../utils/save_new_worker_handler.js'
import { generateEightDigitNumber } from '../../utils/utils.js'
import { delete_user_request_handler } from '../../utils/delete_user_handler.js'

function ScheduleTable() {
    const {
        all_users_with_claims,
        weekDates,
        setSchedule,
        all_users_shifts,
        showClaims,
        department,
        setAllUsers,
        allUsers,
        all_trainees_with_claims,
        all_trainess_shifts
   } = useContext(Context)

   const [addUser, setAddUser] = useState(false)
   const [addTrainee, setAddTrainee] = useState(false)
   const [userTextName, setUserTextName] = useState('')
   const [traineeTextName, setTraineeTextName] = useState('')

   const inputRef = useRef(null);

   useEffect(() => {
    if (addUser || addTrainee) {
        inputRef.current?.focus();
    }
   }, [addUser, addTrainee])


   const all_users_to_show = showClaims ? all_users_with_claims : all_users_shifts
   const all_trainees_to_show = showClaims ? all_trainees_with_claims : all_trainess_shifts

    const handleChange = (userIndex, dateIndex, value) => {
        const merged_to_show = () => {
            return {
                ...all_users_to_show,
                ...all_trainees_to_show
            }
        }

        const copy = structuredClone(merged_to_show());
        const userKey = Object.keys(copy)[userIndex]

        copy[userKey][dateIndex] = value
    
        setSchedule(copy)
    };

    const handleRequest = async (is_trainee) => {
        inputRef.current?.blur();

        const username = is_trainee ? traineeTextName : userTextName
        const copy = structuredClone(allUsers)
        const unique_id_number = generateEightDigitNumber()

        await save_new_worker_request_handler(username, department, unique_id_number, is_trainee)

        setAllUsers({
            ...copy,
            [username]: {
              shifts: Array(7).fill(''),
              unique_id_number: unique_id_number,
              position: department,
              is_trainee: is_trainee
            }
          });
    }

    const handleClick = async (icon, current_username) => {
        if (icon === "plus") {
            setAddUser(true)
        }
        if (icon === "plus_trainee") {
            setAddTrainee(true)
        }
        if (icon === "minus") {
            await delete_user_request_handler(current_username)
            const { [current_username]: removed, ...rest } = allUsers
            setAllUsers(rest)
        }
    }

    const countShift = (dateIndex, shiftType) => {
        return Object.values(all_users_to_show).filter(
            user => user?.[dateIndex] === shiftType
        ).length;
    };


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
            <tr key={user}>
                <td>
                    <div className={styles.workerContainer}>
                        <div className={`${styles.workerContainerButton} ${styles.infoIcon}`}>
                            <div className={styles.workerPopUpMessage}>
                                <p>id:  {allUsers[user].unique_id_number}</p>
                            </div>
                            <svg className = {styles.icon} viewBox="0 0 50 50"> 
                                <path d="M 25 2 C 12.309295 2 2 12.309295 2 25 C 2 37.690705 12.309295 48 25 48 C 37.690705 48 48 37.690705 48 25 C 48 12.309295 37.690705 2 25 2 z M 25 4 C 36.609824 4 46 13.390176 46 25 C 46 36.609824 36.609824 46 25 46 C 13.390176 46 4 36.609824 4 25 C 4 13.390176 13.390176 4 25 4 z M 25 11 A 3 3 0 0 0 22 14 A 3 3 0 0 0 25 17 A 3 3 0 0 0 28 14 A 3 3 0 0 0 25 11 z M 21 21 L 21 23 L 22 23 L 23 23 L 23 36 L 22 36 L 21 36 L 21 38 L 22 38 L 23 38 L 27 38 L 28 38 L 29 38 L 29 36 L 28 36 L 27 36 L 27 21 L 26 21 L 22 21 L 21 21 z"/>
                            </svg>  
                        </div>
                        {user}
                        <button onClick={() => handleClick("minus", user)} className={styles.workerContainerButton}>
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
                            ref = {inputRef}
                            onBlur = {() => {
                                setAddUser(false)
                                setUserTextName('')
                            }}
                            onChange = {(e) => setUserTextName(e.target.value)}
                            onKeyDown = {(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    handleRequest(false)
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

            {Object.keys(all_trainees_to_show).map((user, userIndex) => (
            <tr key={user}>
                <td>
                    <div className={styles.workerContainer}>
                        <div className={`${styles.workerContainerButton} ${styles.infoIcon}`}>
                            <div className={styles.workerPopUpMessage}>
                                <p>id:  {allUsers[user].unique_id_number}</p>
                            </div>
                            <svg className = {styles.icon} viewBox="0 0 50 50"> 
                                <path d="M 25 2 C 12.309295 2 2 12.309295 2 25 C 2 37.690705 12.309295 48 25 48 C 37.690705 48 48 37.690705 48 25 C 48 12.309295 37.690705 2 25 2 z M 25 4 C 36.609824 4 46 13.390176 46 25 C 46 36.609824 36.609824 46 25 46 C 13.390176 46 4 36.609824 4 25 C 4 13.390176 13.390176 4 25 4 z M 25 11 A 3 3 0 0 0 22 14 A 3 3 0 0 0 25 17 A 3 3 0 0 0 28 14 A 3 3 0 0 0 25 11 z M 21 21 L 21 23 L 22 23 L 23 23 L 23 36 L 22 36 L 21 36 L 21 38 L 22 38 L 23 38 L 27 38 L 28 38 L 29 38 L 29 36 L 28 36 L 27 36 L 27 21 L 26 21 L 22 21 L 21 21 z"/>
                            </svg>  
                        </div>
                        {user}
                        <button onClick={() => handleClick} className={styles.workerContainerButton}>
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
                    <p> { Object.values(all_trainees_to_show)[userIndex]?.[dateIndex] } </p> : 
                    <select 
                    value={Object.values(all_trainees_to_show)[userIndex]?.[dateIndex]}
                    onChange={(e) => handleChange((userIndex + Object.keys(all_users_to_show).length), dateIndex, e.target.value)}>
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
                {addTrainee ?
                <td>
                    <div className={styles.userTextContainer}>
                        <TextField 
                            value = {traineeTextName} 
                            tableStyle = {styles.userText}
                            ref = {inputRef}
                            onBlur = {() => {
                                setAddTrainee(false)
                                setTraineeTextName('')
                            }}
                            onChange = {(e) => setTraineeTextName(e.target.value)}
                            onKeyDown = {(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    handleRequest(true)
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
