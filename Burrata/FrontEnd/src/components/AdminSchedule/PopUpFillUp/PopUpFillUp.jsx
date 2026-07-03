import React from 'react'
import PopUpForm from '@/components/PopUp/PopUpForm'
import TableWithDates from '@/components/TableWithDates/TableWithDates'
import TextField from '@/components/TextField/TextField'
import styles from './PopUpFillUp.module.css'

function PopUpFillUp(props) {

  const {
    dates,
    days,
    setDays
  } = props

  const handleChange = (e) => {
    let input = e.target.value

    input = input.replace(/[^0-9/]/g, "")

    setDays(prev => ({
      ...prev,
      [e.target.name]: input
  }))
  }

  return (
    <PopUpForm
    title = 'Auto Fill Up'
    buttonText = 'Submit'>
      <TableWithDates
            dates = {dates}>
              <tr className={styles.row}>
              {dates?.map((date, i) => (
                <td className={styles.rowElement} key={date}>
                  <TextField
                  textFieldStyle = {styles.input}
                  onChange = {handleChange}
                  label = {Object.keys(days)[i]}
                  name = {Object.keys(days)[i]}
                  value = {Object.values(days)[i]}
                  placeholder="X/Y"
                  inputMode="numeric"/>
                </td>
              ))}
              </tr>
        </TableWithDates>
    </PopUpForm>
  )
}

export default PopUpFillUp
