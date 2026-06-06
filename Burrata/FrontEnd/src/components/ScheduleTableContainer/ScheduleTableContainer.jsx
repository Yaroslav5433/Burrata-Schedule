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
      schedule
  } = useContext(Context)

  const { showNotification } = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault()

    const action = e.nativeEvent.submitter.value;
  
    if (action === "save table") {
      await save_schedule_table_request_handler(schedule);
      showNotification('Schedule has been saved')
    }

    if (action === "save claims") {
      await save_users_claims_request_handler(usersWithClaims);
      showNotification('Claims have been saved')
    }
  };

  return (
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
  )
}

export default ScheduleTableContainer
