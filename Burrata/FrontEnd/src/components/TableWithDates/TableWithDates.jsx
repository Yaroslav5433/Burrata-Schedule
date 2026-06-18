import React from 'react'
import styles from './TableWithDates.module.css'

function TableWithDates(props) {
  const {
    children,
    dates
  } = props

  return (
    <table className={styles.table}>
        <tbody>
          <tr>
            {dates.map((date, i) => (
              <td key={i}>{date}</td>
            ))}
          </tr>

          {children}
        </tbody>
    </table>
  )
}

export default TableWithDates
