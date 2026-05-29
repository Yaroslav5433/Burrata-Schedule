import React from 'react'
import DepartmentsElements from '../DepartmentsElements/DepartmentsElements'
import styles from './DepartmentsNavBar.module.css'

function DepartmentsNavBar() {
  return (
    <nav className={styles.navigation}>
      <DepartmentsElements/>
    </nav>
  )
}

export default DepartmentsNavBar
