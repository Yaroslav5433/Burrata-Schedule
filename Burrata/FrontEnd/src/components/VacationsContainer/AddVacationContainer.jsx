import React from 'react'
import Button from '@/components/Button/Button'
import { Calendar } from 'primereact/calendar'
import styles from './VacationsContainer.module.css'
import { useHandleSaveVacations } from '@/hooks/vacationsPageHooks/useHandleEditVacations'
import { useVacationsStore } from '@/hooks/vacationsPageHooks/stores/useVacationsStore'
import { useGetUsersForSelect } from '@/hooks/vacationsPageHooks/useGetUsersForSelect'

function AddVacationContainer() {

  const dates = useVacationsStore(state => state.dates)
  const setDates = useVacationsStore(state => state.setDates)
  const username = useVacationsStore(state => state.username)
  const setUsername = useVacationsStore(state => state.setUsername)
  const setAddVacation = useVacationsStore(state => state.setAddVacation)

  const usersForSelect = useGetUsersForSelect()

  const handleSaveVacations = useHandleSaveVacations()

  return (
    <div className={styles.container}>
        <div className={styles.line}>
            <p>Username:</p>
            <select 
            className={styles.select}
            value = {username}
            onChange={(e) => setUsername(e.target.value)}>
                <option value=""></option>
                {usersForSelect.map((user, userId) => (
                <option key = {userId} value={user}>{user}</option>
                ))}
            </select>
        </div>
        <div className={styles.line}>
            <p>Vacation Period:</p>
            <Calendar value={dates} onChange={(e) => setDates(e.value)} selectionMode="range" readOnlyInput hideOnRangeSelection />
        </div>
        <div className={styles.buttonsContainer}>
            <Button
            buttonText = 'Save'
            buttonStyle = {styles.button}
            onClick = {() => handleSaveVacations()}
            />
            <Button
            buttonText = 'Cancel'
            buttonStyle = {styles.button}
            onClick = {() => setAddVacation(false)}
            />
        </div>
    </div>
  )
}

export default AddVacationContainer
