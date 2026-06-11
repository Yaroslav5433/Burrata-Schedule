import React, {useContext} from 'react'
import styles from './ScheduleTableContainer.module.css'
import ScheduleTable from '../ScheduleTable/ScheduleTable'
import Button from '../Button/Button'
import Checkbox from '../Checkbox/Checkbox'
import { Context } from '../Context'
import { save_users_claims_request_handler } from '../../utils/save_users_claims_handler' 
import { save_schedule_table_request_handler } from '../../utils/save_schedule_table_handler'
import { useNotification } from "../ModalWindow/ModalWindow";

function ScheduleTableContainer() {

  const {
      showClaims,
      setShowClaims,
      usersWithClaims,
      schedule,
      dateStep,
      setDateStep
  } = useContext(Context)

  const { showNotification } = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault()

    const action = e.nativeEvent.submitter.value;
  
    if (action === "save table") {
      await save_schedule_table_request_handler(schedule, dateStep);
      showNotification('Schedule has been saved')
    }

    if (action === "save claims") {
      await save_users_claims_request_handler(usersWithClaims, dateStep);
      showNotification('Claims have been saved')
    }
  };

  const handleClick = (step) => {
    setDateStep(prev => prev + step)
  }

  console.log(schedule)

  return (
    <div className={styles.tableFullContainer}>
      <button onClick={() => handleClick(-7)} className={styles.workerContainerButton}>
        <svg className = {styles.icon} viewBox="0 0 24 24" fill="none">
          <path d="M15 18L9 12L15 6 M23 18L17 12L23 6"/>
        </svg>
      </button>
      <button onClick={() => handleClick(-1)} className={styles.workerContainerButton}>
        <svg className = {styles.icon} viewBox="0 0 24 24" fill="none">
          <path d="M15 18L9 12L15 6"/>
        </svg>
      </button>
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
      <button onClick={() => handleClick(1)} className={styles.workerContainerButton}>
        <svg className = {styles.icon} viewBox="0 0 24 24" fill="none">
          <path d="M9 18L15 12L9 6"/>
        </svg>
      </button>
      <button onClick={() => handleClick(7)} className={styles.workerContainerButton}>
        <svg className = {styles.icon} viewBox="0 0 24 24" fill="none">
          <path d="M9 18L15 12L9 6 M17 18L23 12L17 6"/>
        </svg>
      </button>
    </div>
  )
}

export default ScheduleTableContainer
