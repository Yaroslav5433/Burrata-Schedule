import React from 'react'
import styles from './HomeMainSection.module.css'
import ScheduleTableContainer from '../ScheduleTableContainer/ScheduleTableContainer'

function HomeMainSection() {
  return (
    <main className={styles.mainContainer}>
        <ScheduleTableContainer/>
    </main>
  )
}

export default HomeMainSection
