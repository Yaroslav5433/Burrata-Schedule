import styles from './PopUp.module.css'
import TableWithDates from '../TableWithDates/TableWithDates'
import TextField from '../TextField/TextField'
import Button from '../Button/Button'
import React, { useContext, useState } from 'react'
import Animation from '../Animation/Animation'
import SvgButtonIcon from '../Svgs/SvgButtonIcon'
import { Context } from '../Context'

function PopUp(props) {
  const {
    setPopUpIsOpen
  } = useContext(Context)

  const {
    dates,
    handleFillUpSubmit,
  } = props

  const [days, setDays] = useState({
    'Monday': '',
    'Tuesday': '',
    'Wednesday': '',
    'Thursday': '',
    'Friday': '',
    'Saturday': '',
    'Sunday': ''
  });

  const handleChange = (e) => {
    let input = e.target.value

    input = input.replace(/[^0-9/]/g, "")

    setDays(prev => ({
      ...prev,
      [e.target.name]: input
  }))
  }

  const handleClick = () => {
    setPopUpIsOpen(false)
  }

  console.log(days)

  return (
      <div className = {styles.pop_up_overlay}>
        <Animation>
          <form className={styles.popup_container} onSubmit={(e) => handleFillUpSubmit(e, days)}>
            <h2
            className={styles.pop_up_title}>Auto fill up</h2>
            <TableWithDates
            dates = {dates}>
              <tr>
              {dates?.map((date, i) => (
                <td key={date}>
                  <TextField
                  textFieldStyle = {styles.table_input}
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
            <Button
            type = 'submit'
            buttonText = 'Send'/>
            <SvgButtonIcon
            path = "M20 20L4 4.00003M20 4L4.00002 20"
            buttonStyles = {styles.pop_up_cross_button}
            svgStyles = {styles.pop_up_cross_icon}
            onClick = {handleClick}/>
          </form>
        </Animation>
      </div>
  )
}

export default PopUp
