import React, { useContext } from 'react'
import PopUpForm from '@/components/PopUp/PopUpForm'
import styles from './PopUpEditUser.module.css'
import { Context } from '@/components/Context'

function PopUpEditUser(props) {

  const {
    availableShiftsValues,
    totalMaxShifts
  } = props

  const {
    days,
    setDays,
    userTextName
  } = useContext(Context)

  console.log(availableShiftsValues)
  console.log(totalMaxShifts)

  return (
    <PopUpForm
    title = {userTextName}
    buttonText = 'Submit'>
      <table className={styles.table}>
        <tbody>
          <tr>
            {Object.keys(totalMaxShifts).map((date, i) => (
              <td key={i}>{date}</td>
            ))}
          </tr>
        </tbody>
      </table>
      <table className={styles.table}>
        <tbody>
          <tr>
            {Object.keys(days).map((date, i) => (
              <td key={i}>{date}</td>
            ))}
          </tr>
        </tbody>
      </table>
      
    </PopUpForm>
  )
}

export default PopUpEditUser
