import React, { useContext } from 'react'
import styles from './ScheduleTableContainer.module.css'
import ScheduleTable from '@/components/AdminSchedule/ScheduleTable/ScheduleTable'
import Button from '@/components/Button/Button'
import Checkbox from '@/components/Checkbox/Checkbox'
import SvgButtonIcon from '@/components/Svgs/SvgButtonIcon'
import { useNotification } from "@/components/ModalWindow/ModalWindow";
import { useSaveIntoSchedule } from '@/hooks/scheduleMutations'
import { Context } from '@/components/Context'
import Spinner from '@/components/Spinner/Spinner'

function ScheduleTableContainer(props) {

  const {
    showClaims,
    department,
    setIsEdit,
    isEdit,
    draftSchedule,
    setPopUpIsOpen,
    loading,
    setLoading,
    setCustomEdit,
    customEdit
  } = useContext(Context)

  const {
    setShowClaims,
    usersWithClaims,
    setDateStep,
    handleDraftSet,
    dateStep,
  } = props

  const { showNotification } = useNotification();
  const saveIntoSchedule = useSaveIntoSchedule(dateStep, department);

  const handleSaveSchedule = () => {
    setLoading(true)

    saveIntoSchedule.mutate({
      schedule: draftSchedule
    }, {
      onSuccess: () => {
        showNotification('Schedule has been saved')
        setIsEdit(false)
        setCustomEdit(false)
      },
      onError: () => {
        showNotification('Error while saving')
      },
      onSettled: () => {
        setLoading(false)
    }})
  }

  const handleSaveClaims = () => {
    setLoading(true)
    saveIntoSchedule.mutate({
      schedule: usersWithClaims
    }, {
      onSuccess: () => {
        showNotification('Claims have been saved')
        setShowClaims(false)
      },
      onError: () => {
        showNotification('Error while saving')
      },
      onSettled: () => {
        setLoading(false)
    }})
  }

  const handleClick = (step) => {
    setDateStep(prev => prev + step)
  }

  const handleEditClick = (action) => {
    if (action == "edit table") {
      handleDraftSet()
      setCustomEdit(false)
      setShowClaims(false)
      setIsEdit(true)
    }
    if (action == "cancel changes") {
      setIsEdit(false)
    }
    if (action == "custom edit") {
      handleDraftSet()
      setShowClaims(false)
      setCustomEdit(true)
    }
    if (action == "cancel custom changes") {
      setCustomEdit(false)
    }
  }

  return (
    <div className={styles.tableFullContainer}>
      {(!isEdit && !customEdit) && 
      <>
      <SvgButtonIcon
      path = "M15 18L9 12L15 6 M23 18L17 12L23 6"
      onClick = {() => handleClick(-7)}/>
      <SvgButtonIcon
      path = "M15 18L9 12L15 6"
      onClick = {() => handleClick(-1)}/>
      </>}
      <form className={styles.container}>
          <div className={styles.top_button_line}>
              <span 
              className={styles.tablename_span}>
              <h2>Schedule</h2>
              </span>
              {(!isEdit && !customEdit) &&
              <Checkbox
              checkboxText = 'Show Claims'
              checked = {showClaims}
              onChange = {(e) => (setShowClaims(e.target.checked))}/>}
          </div>
          <div className={styles.loading_container}>
              <div className = {loading ? styles.blurred : ""}>
                <ScheduleTable/>
              </div>
              {loading && (
                  <div className = {styles.loading_overlay}>
                      <Spinner/>
                  </div>
              )}
          </div>
          <div className={styles.bottom_button_line}>
            {isEdit &&
            <>
            <Button
            buttonStyle = {styles.bottom_button}
            buttonText = 'Cancel Changes'
            type='button'
            onClick = {() => handleEditClick("cancel changes")}/>
            <Button
            buttonStyle = {styles.bottom_button}
            buttonText = 'Auto Fill Up'
            type='button'
            name='action'
            value='fill up'
            onClick = {() => setPopUpIsOpen(true)}/>
            <Button
            buttonStyle = {styles.bottom_button}
            buttonText = 'Save changes'
            type='button'
            onClick={handleSaveSchedule}/> 
            </> }
            {customEdit &&
            <>
            <Button
            buttonStyle = {styles.bottom_button}
            buttonText = 'Cancel Changes'
            type='button'
            onClick = {() => handleEditClick("cancel custom changes")}/>
            <Button
            buttonStyle = {styles.bottom_button}
            buttonText = 'Save changes'
            type='button'
            onClick={handleSaveSchedule}/>
            </>}
            {(!isEdit && !customEdit) &&
            <>
            <Button
            buttonStyle = {styles.bottom_button}
            buttonText = 'Edit Table'
            type='button'
            value='edit table'
            onClick = {() => handleEditClick("edit table")}/>
            <Button
            buttonStyle = {styles.bottom_button}
            buttonText = 'CustomEdit'
            type='button'
            value='custom edit'
            onClick={() => handleEditClick("custom edit")}/>
            <Button
            buttonStyle = {styles.bottom_button}
            buttonText = 'Save all claims'
            type='button'
            onClick={handleSaveClaims}/>
            </>}
          </div>
      </form>
      {(!isEdit && !customEdit) && 
      <>
      <SvgButtonIcon
      path = "M9 18L15 12L9 6"
      onClick = {() => handleClick(+1)}/>
      <SvgButtonIcon
      path = "M9 18L15 12L9 6 M17 18L23 12L17 6"
      onClick = {() => handleClick(+7)}/>
      </>}
    </div>
  )
}

export default ScheduleTableContainer
