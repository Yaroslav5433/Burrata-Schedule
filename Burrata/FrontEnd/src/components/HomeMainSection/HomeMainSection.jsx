import React from 'react'
import styles from './HomeMainSection.module.css'
import ScheduleTableContainer from '../ScheduleTableContainer/ScheduleTableContainer'

function HomeMainSection() {
  return (
    <main className={styles.mainContainer}>
        <ScheduleTableContainer/>
          <h1>Messages</h1>
    </main>
  )
}

export default HomeMainSection
