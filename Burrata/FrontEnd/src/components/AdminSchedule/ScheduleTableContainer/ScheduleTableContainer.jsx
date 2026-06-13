import React, { useContext } from 'react'
import styles from './ScheduleTableContainer.module.css'
import ScheduleTable from '@/components/AdminSchedule/ScheduleTable/ScheduleTable'
import Button from '@/components/Button/Button'
import Checkbox from '@/components/Checkbox/Checkbox'
import SvgButtonIcon from '@/components/Svgs/SvgButtonIcon'
import { useNotification } from "@/components/ModalWindow/ModalWindow";
import { useSaveClaimsIntoSchedule } from '@/hooks/scheduleMutations'
import { Context } from '@/components/Context'

function ScheduleTableContainer(props) {

  const {
    showClaims,
    department
  } = useContext(Context)

  const {
    setShowClaims,
    usersWithClaims,
    schedule,
    dateStep,
    setDateStep
  } = props

  const { showNotification } = useNotification();
  const saveClaimsIntoSchedule = useSaveClaimsIntoSchedule(dateStep, department);

  const handleSubmit = async (e) => {
    e.preventDefault()

    const action = e.nativeEvent.submitter.value;
  
    if (action === "save table") {
      saveClaimsIntoSchedule.mutate({
        schedule
      })
      showNotification('Schedule has been saved')
    }

    if (action === "save claims") {
      saveClaimsIntoSchedule.mutate({
        usersWithClaims
      })
      showNotification('Claims have been saved')
    }
  };

  const handleClick = (step) => {
    setDateStep(prev => prev + step)
  }

  console.log(schedule)

  return (
    <div className={styles.tableFullContainer}>
      <SvgButtonIcon
      path = "M15 18L9 12L15 6 M23 18L17 12L23 6"
      onClick = {() => handleClick(-7)}/>
      <SvgButtonIcon
      path = "M15 18L9 12L15 6"
      onClick = {() => handleClick(-1)}/>
      <form className={styles.container} onSubmit={handleSubmit}>
          <div className={styles.top_button_line}>
              <span 
              className={styles.tablename_span}>
              <h2>Schedule</h2>
              </span>
              <Checkbox
              checkboxText = 'Show Claims'
              checked = {showClaims}
              onChange = {(e) => setShowClaims(e.target.checked)}/>
          </div>
          <ScheduleTable/>
          <div className={styles.bottom_button_line}>
              <Button
              buttonStyle = {styles.bottom_button}
              buttonText = 'Auto Fill Up'
              type='submit'
              name='action'
              value='fill up'/>
              <Button
              buttonStyle = {styles.bottom_button}
              buttonText = 'Save Table'
              type='submit'
              name='action'
              value='save table'/>
              <Button
              buttonStyle = {styles.bottom_button}
              buttonText = 'Save all claims'
              type='submit'
              name='action'
              value='save claims'/>
          </div>
      </form>
      <SvgButtonIcon
      path = "M9 18L15 12L9 6"
      onClick = {() => handleClick(+1)}/>
      <SvgButtonIcon
      path = "M9 18L15 12L9 6 M17 18L23 12L17 6"
      onClick = {() => handleClick(+7)}/>
    </div>
  )
}

export default ScheduleTableContainer
