import React, { useEffect, useContext, useState, useRef } from 'react'
import styles from './ScheduleTable.module.css'
import { Context } from '@/components/Context.js'
import EmptyRowInTable from '@/components/AdminSchedule/TableElements/EmptyRowInTable/EmptyRowInTable.jsx'
import ValuesInTable from '@/components/AdminSchedule/TableElements/ValuesInTable/ValuesInTable.jsx'
import AddUserInTable from '@/components/AdminSchedule/TableElements/AddUserInTable/AddUserInTable.jsx'
import CountValuesInTable from '@/components/AdminSchedule/TableElements/CountValuesInTable/CountValuesInTable.jsx'
import { generateEightDigitNumber } from '@/utils/utils.js'
import { useDeleteUser, useSaveUser } from '@/hooks/usersMutations'
import { useDates } from '@/hooks/useDates'
import { useScheduleStore } from '@/hooks/homePageHooks/stores/useScheduleStore'

function ScheduleTable() {

    const {department} = useRef();

    const dateStep = useScheduleStore(state => state.dateStep)

    const weekDates = useDates(dateStep)

    const {
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

        const merged_to_show = {
            ...all_workers_to_show,
            ...all_trainees_to_show
        }
        
        const copy = structuredClone(merged_to_show)

        copy[user][dateIndex] = value
        
        setDraftSchedule(copy)
    };

    const handleRequest = async (is_trainee) => {
        inputRef.current?.blur();

        const unique_id_number = generateEightDigitNumber()

        saveUser.mutate({
            username: userTextName,
            unique_id_number: unique_id_number,
            is_trainee: is_trainee
        })
    }

    const handleClick = (icon, current_username) => {
        if (icon === "plus") {
            setAddUser({'state': true, 'is_trainee': false})
        }
        if (icon === "plus_trainee") {
            setAddUser({'state': true, 'is_trainee': true})
        }
        if (icon === "minus") {
            deleteUser.mutate({
                current_username
            })
        }
        if (icon === "edit") {
            console.log('opapa')
            setPopUpIsOpen("edituser")
            setUserTextName(current_username)
        }
    }

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
            weekDates = {weekDates}/>

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
