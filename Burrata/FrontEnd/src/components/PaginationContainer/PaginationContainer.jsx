import React from 'react'
import styles from './PaginationContainer.module.css'

function PaginationContainer(props) {
  const {
    paginationTitle,
    children
  } = props

  return (
    <>
    <h2 className={styles.pagination_title}>{paginationTitle}</h2>
    <div className={styles.pagination_container}>
        {children}
    </div>
    </>
  )
}

export default PaginationContainer
