import React from 'react'
import styles from './TableWithDates.module.css'

function TableWithDates(props) {
  const {
    children,
    dates,
    orientation
  } = props

  return (
    <table className={styles.table_with_dates}>
        <tbody>
            {orientation === 'vertical' ? (
                dates.map((date, dateId) => (
                  <React.Fragment key={dateId}>
                    {children(date, dateId)}
                  </React.Fragment>))
            ) : (
                <>
                    <tr>
                        {dates?.map((date, i) => (
                            <td key={i}>{date}</td>
                        ))}
                    </tr>

                    {children}
                </>
            )}
        </tbody>
    </table>
  )
}

export default TableWithDates
