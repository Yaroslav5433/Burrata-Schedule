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
import IsEditButtons from './ButtonsContainers/IsEditButtons'
import CustomEditButtons from './ButtonsContainers/CustomEditButtons'
import BasicButtons from './ButtonsContainers/BasicButtons'

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
    <div className={styles.tableMainContainer}>
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
          <div className={styles.topLine}>
              <span 
              className={styles.tablenameSpan}>
              <h2>Schedule</h2>
              </span>
              {(!isEdit && !customEdit) &&
              <Checkbox
              checkboxText = 'Show Claims'
              checked = {showClaims}
              onChange = {(e) => (setShowClaims(e.target.checked))}/>}
          </div>
          <div className={styles.loading}>
              <div className = {loading ? styles.blurred : ""}>
                <ScheduleTable/>
              </div>
              {loading && (
                  <div className = {styles.loadingOverlay}>
                      <Spinner/>
                  </div>
              )}
          </div>
          <div className={styles.bottomLine}>
            {isEdit &&
            <IsEditButtons
            handleEditClick = {handleEditClick}
            handleSaveSchedule = {handleSaveSchedule}
            setPopUpIsOpen = {setPopUpIsOpen}/>
            }
            {customEdit &&
            <CustomEditButtons
            handleEditClick = {handleEditClick}
            handleSaveSchedule = {handleSaveSchedule}/>}
            {(!isEdit && !customEdit) &&
            <BasicButtons
            handleEditClick = {handleEditClick}
            handleSaveClaims = {handleSaveClaims}/>}
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
