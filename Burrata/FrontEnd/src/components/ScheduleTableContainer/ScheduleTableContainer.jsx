import React from 'react'
import styles from './ScheduleTableContainer.module.css'
import ScheduleTable from '../ScheduleTable/ScheduleTable'
import Button from '../Button/Button'

function ScheduleTableContainer() {
  return (
    <form className={styles.container}>
        <div className={styles.top_button_line}>
            <Button
            buttonText='Claims'
            buttonStyle = {styles.table_button}
            isCurrent = {styles.table_button_is_current}/>
            <Button
            buttonText='Schedule'
            buttonStyle = {styles.table_button}/>
        </div>
        <ScheduleTable/>
        <div className={styles.bottom_button_line}>
            <Button
            buttonText='Show Claims'/>
            <Button
            buttonText='Auto Fill Up'/>
            <Button
            buttonText='Export PDF'/>
        </div>

    </form>
  )
}

export default ScheduleTableContainer
