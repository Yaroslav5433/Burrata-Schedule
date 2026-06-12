import React, { useEffect, useContext, useState, useRef } from 'react'
import styles from './ScheduleTable.module.css'
import { Context } from '../Context.js'
import EmptyRowInTable from '../EmptyRowInTable/EmptyRowInTable.jsx'
import ValuesInTable from '../ValuesInTable/ValuesInTable.jsx'
import AddUserInTable from '../AddUserInTable/AddUserInTable.jsx'
import CountValuesInTable from '../CountValuesInTable/CountValuesInTable.jsx'
import { save_new_worker_request_handler } from '../../utils/save_new_worker_handler.js'
import { generateEightDigitNumber } from '../../utils/utils.js'
import { delete_user_request_handler } from '../../utils/delete_user_handler.js'

function ScheduleTable() {

    const {
        weekDates,
        setSchedule,
        department,
        setAllUsers,
        allUsers,
        all_trainees_to_show,
        all_workers_to_show,
        showClaims
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


    const handleChange = (userIndex, dateIndex, value, is_trainees) => {
        if (is_trainees) {
            userIndex += Object.keys(all_workers_to_show).length
        }

        const merged_to_show = () => {
            return {
                ...all_workers_to_show,
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
        return Object.values(all_workers_to_show).filter(
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

            <ValuesInTable
            all_users_to_show = {all_workers_to_show}
            handleClick = {handleClick}
            showClaims = {showClaims}
            handleChange = {handleChange}
            is_trainees = {false}>
            </ValuesInTable>


            <AddUserInTable
            addUser = {addUser}
            setAddUser = {setAddUser}
            setUserTextName = {setUserTextName}
            handleRequest = {handleRequest}
            userTextName = {userTextName}
            inputRef = {inputRef}
            handleClick = {handleClick}
            icon_name = 'plus'
            is_trainee = {false}/>

            <EmptyRowInTable/>

            <CountValuesInTable
            weekDates = {weekDates}
            countShift = {countShift}/>

            <EmptyRowInTable/>

            <ValuesInTable
            all_users_to_show = {all_trainees_to_show}
            handleClick = {handleClick}
            showClaims = {showClaims}
            handleChange = {handleChange}
            is_trainees = {true}>
            </ValuesInTable>

            <AddUserInTable
            addUser = {addTrainee}
            setAddUser = {setAddTrainee}
            setUserTextName = {setTraineeTextName}
            handleRequest = {handleRequest}
            userTextName = {traineeTextName}
            inputRef = {inputRef}
            handleClick = {handleClick}
            icon_name = 'plus_trainee'
            is_trainee = {true}/>

        </tbody>
      </table>
  )
}

export default ScheduleTable
