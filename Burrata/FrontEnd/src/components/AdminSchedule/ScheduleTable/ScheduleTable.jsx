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
        department,
        all_trainees_to_show,
        all_workers_to_show,
        showClaims,
        setDraftSchedule,
        draftSchedule,
        setPopUpIsOpen,
        userTextName,
        setUserTextName,
        addUser,
        setAddUser
   } = useContext(Context)

   const saveUser = useSaveUser(department)
   const deleteUser = useDeleteUser(department)

   const inputRef = useRef(null);

   useEffect(() => {
    if (addUser) {
        inputRef.current?.focus();
    }
   }, [addUser])


    const handleEditChange = (user, dateIndex, value) => {
        console.log(draftSchedule)

        const merged_to_show = {
            ...all_workers_to_show,
            ...all_trainees_to_show
        }
        
        const copy = structuredClone(merged_to_show)

        copy[user][dateIndex] = value
        
        setDraftSchedule(copy)
    };

    const handleRequest = async (isTrainee) => {
        inputRef.current?.blur();

        const unique_id_number = generateEightDigitNumber()

        saveUser.mutate({
            username: userTextName,
            uniqueIdNumber: uniqueIdNumber,
            isTrainee: isTrainee
        })
    }

    const handleClick = (icon, current_user_id) => {
        if (icon === "plus") {
            setAddUser({'state': true, 'is_trainee': false})
        }
        if (icon === "plus_trainee") {
            setAddUser({'state': true, 'is_trainee': true})
        }
        if (icon === "minus") {
            deleteUser.mutate({
                current_user_id
            })
        }
        if (icon === "edit") {
            setPopUpIsOpen("edituser")
            setUserTextName(current_username)
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
            handleEditChange = {handleEditChange}/>

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
            handleEditChange = {handleEditChange}/>

            <AddUserInTable
            addUser = {addUser}
            setAddUser = {setAddUser}
            setUserTextName = {setUserTextName}
            handleRequest = {handleRequest}
            userTextName = {userTextName}
            inputRef = {inputRef}
            handleClick = {handleClick}
            icon_name = 'plus_trainee'
            is_trainee = {true}/>

        </tbody>
      </table>
  )
}

export default ScheduleTable
