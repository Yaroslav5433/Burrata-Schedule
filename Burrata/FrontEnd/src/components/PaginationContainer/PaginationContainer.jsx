import React from 'react'
import styles from './PaginationContainer.module.css'

function PaginationContainer(props) {
  const {
    paginationTitle,
    children
  } = props

  return (
    <>
    <h2 className={styles.title}>{paginationTitle}</h2>
    <div className={styles.container}>
        {children}
    </div>
    </>
  )
}

export default PaginationContainer
