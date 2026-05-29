import React from 'react'
import DepartmentsNavBar from '../DepartmentsNavBar/DepartmentsNavBar'
import HomeMainSection from '../HomeMainSection/HomeMainSection'
import styles from './HomePageContainer.module.css'

function HomePageContainer() {
  return (
    <div className={styles.container}>
        <DepartmentsNavBar/>
        <HomeMainSection/>
    </div>
  )
}

export default HomePageContainer
