import React, { useContext } from 'react'
import Button from '@/components/Button/Button'
import styles from '../ScheduleTableContainer.module.css'
import { Context } from '@/components/Context'

function IsEditButtons(props) {

  const {
    department
  } = useContext(Context)

  const {
    handleEditClick,
    handleSaveSchedule,
    setPopUpIsOpen
  } = props

  return (
    <>
        <Button
        buttonStyle = {styles.bottomButton}
        buttonText = 'Cancel Changes'
        type='button'
        onClick = {() => handleEditClick("cancel changes")}/>
        {department == 'service' && 
        <Button
        buttonStyle = {styles.bottomButton}
        buttonText = 'Auto Fill Up'
        type='button'
        name='action'
        value='fill up'
        onClick = {() => {setPopUpIsOpen('fillup')}}/>}
        <Button
        buttonStyle = {styles.bottomButton}
        buttonText = 'Save changes'
        type='button'
        onClick={handleSaveSchedule}/> 
    </>
  )
}

export default IsEditButtons
