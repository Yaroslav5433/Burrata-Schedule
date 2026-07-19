import React from 'react'
import Button from '@/components/Button/Button'
import styles from '../ScheduleTableContainer.module.css'
import { useParams } from 'react-router-dom'
import { usePopupStore } from '@/hooks/homePageHooks/stores/usePopUpStore'

function IsEditButtons(props) {

  const { department } = useParams()

  const openPopup = usePopupStore(state => state.openPopup) 

  const {
    handleEditClick,
    handleSaveSchedule,
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
        onClick = {() => {openPopup('fillup')}}/>}
        <Button
        buttonStyle = {styles.bottomButton}
        buttonText = 'Save changes'
        type='button'
        onClick={handleSaveSchedule}/> 
    </>
  )
}

export default IsEditButtons
