import React, { useContext } from 'react'
import Button from '@/components/Button/Button'
import { Calendar } from 'primereact/calendar'
import styles from './VacationsContainer.module.css'
import { Context } from '@/components/Context'

function AddVacationContainer() {

  const {
    username,
    setUsername,
    getUsersForSelect,
    dates,
    setDates,
    handleSaveVacations,
    setAddVacation
  } = useContext(Context)

  return (
    <div className={styles.container}>
        <div className={styles.line}>
            <p>Username:</p>
            <select 
            className={styles.select}
            value = {username}
            onChange={(e) => setUsername(e.target.value)}>
                <option value=""></option>
                {getUsersForSelect().map((user, userId) => (
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
