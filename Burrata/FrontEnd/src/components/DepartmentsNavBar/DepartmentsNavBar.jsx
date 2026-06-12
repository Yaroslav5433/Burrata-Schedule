import React from 'react'
import DepartmentsElements from '../DepartmentsElements/DepartmentsElements'
import styles from './DepartmentsNavBar.module.css'
import { memo } from 'react'

function DepartmentsNavBar() {
  return (
    <nav className={styles.navigation}>
      <DepartmentsElements/>
    </nav>
  )
}

export default memo(DepartmentsNavBar)
