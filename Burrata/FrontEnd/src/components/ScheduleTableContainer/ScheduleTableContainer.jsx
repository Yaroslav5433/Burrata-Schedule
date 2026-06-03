import React, {useContext} from 'react'
import styles from './ScheduleTableContainer.module.css'
import ScheduleTable from '../ScheduleTable/ScheduleTable'
import Button from '../Button/Button'
import Checkbox from '../Checkbox/Checkbox'
import { Context } from '../Context'

function ScheduleTableContainer() {

  const {
      showClaims,
      setShowClaims
  } = useContext(Context)

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const action = e.nativeEvent.submitter.value;
  
    if (action === "save table") {
      console.log("Saving table...");
    }

    if (action === "save claims") {
      console.log("Saving claims...");
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
