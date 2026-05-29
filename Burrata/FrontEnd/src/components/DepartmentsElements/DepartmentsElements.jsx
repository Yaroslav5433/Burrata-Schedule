import React from 'react'
import styles from './DepartmentsElements.module.css'

function DepartmentsElements() {
  return (
    <ul className={styles.container}>
        <li className={styles.container_item}>
            <a href="" className={styles.container_item_link}>Bar</a>
        </li>
        <li className={styles.container_item}>
            <a href="" className={`${styles.container_item_link} ${styles.container_item_link_is_current}`}>Service</a>
        </li>
        <li className={styles.container_item}>
            <a href="" className={styles.container_item_link}>Hostess</a>
        </li>
    </ul>
  )
}

export default DepartmentsElements
