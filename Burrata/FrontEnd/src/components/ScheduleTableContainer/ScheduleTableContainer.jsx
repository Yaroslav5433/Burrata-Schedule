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

  return (
    <form className={styles.container}>
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
            buttonText = 'Auto Fill Up'/>
            <Button
            buttonStyle = {styles.bottom_button}
            buttonText = 'Save Table'/>
        </div>

    </form>
  )
}

export default ScheduleTableContainer
