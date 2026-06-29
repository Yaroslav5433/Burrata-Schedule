import React from 'react'
import styles from '../ScheduleTableContainer.module.css'
import Button from '@/components/Button/Button'

function CustomEditButtons(props) {

  const {
    handleEditClick,
    handleSaveSchedule
  } = props

  return (
    <>
        <Button
        buttonStyle = {styles.bottomButton}
        buttonText = 'Cancel Changes'
        type='button'
        onClick = {() => handleEditClick("cancel custom changes")}/>
        <Button
        buttonStyle = {styles.bottomButton}
        buttonText = 'Save changes'
        type='button'
        onClick={handleSaveSchedule}/>
    </>
  )
}

export default CustomEditButtons
