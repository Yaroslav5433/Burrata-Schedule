import React from 'react'
import styles from '../ScheduleTableContainer.module.css'
import Button from '@/components/Button/Button'

function BasicButtons(props) {

  const {
    handleEditClick,
    handleSaveClaims
  } = props

  return (
    <>
        <Button
        buttonStyle = {styles.bottomButton}
        buttonText = 'Edit Table'
        type='button'
        value='edit table'
        onClick = {() => handleEditClick("edit table")}/>
        <Button
        buttonStyle = {styles.bottomButton}
        buttonText = 'CustomEdit'
        type='button'
        value='custom edit'
        onClick={() => handleEditClick("custom edit")}/>
        <Button
        buttonStyle = {styles.bottomButton}
        buttonText = 'Save all claims'
        type='button'
        onClick={handleSaveClaims}/>
    </>
  )
}

export default BasicButtons
