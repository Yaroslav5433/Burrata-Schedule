import React, { useEffect, useContext, useState, useRef } from 'react'
import styles from './ScheduleTable.module.css'
import { Context } from '@/components/Context.js'
import EmptyRowInTable from '@/components/AdminSchedule/TableElements/EmptyRowInTable/EmptyRowInTable.jsx'
import ValuesInTable from '@/components/AdminSchedule/TableElements/ValuesInTable/ValuesInTable.jsx'
import AddUserInTable from '@/components/AdminSchedule/TableElements/AddUserInTable/AddUserInTable.jsx'
import CountValuesInTable from '@/components/AdminSchedule/TableElements/CountValuesInTable/CountValuesInTable.jsx'
import { generateEightDigitNumber } from '@/utils/utils.js'
import { useDeleteUser, useSaveUser } from '@/hooks/usersMutations'

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

   const saveUser = useSaveUser(department)
   const deleteUser = useDeleteUser(department)

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
        const unique_id_number = generateEightDigitNumber()

        saveUser.mutate({
            username,
            unique_id_number,
            is_trainee
        })
    }

    const handleClick = async (icon, current_username) => {
        if (icon === "plus") {
            setAddUser(true)
        }
        if (icon === "plus_trainee") {
            setAddTrainee(true)
        }
        if (icon === "minus") {
            deleteUser.mutate({
                current_username
            })
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
