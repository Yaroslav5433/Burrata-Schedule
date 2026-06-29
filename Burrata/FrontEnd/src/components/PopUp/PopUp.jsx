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
      <div className = {styles.overlay}>
        <Animation>
          <form className={styles.container} onSubmit={(e) => handleFillUpSubmit(e, days)}>
            <h2
            className={styles.title}>Auto fill up</h2>
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
            <Button
            type = 'submit'
            buttonText = 'Send'/>
            <SvgButtonIcon
            path = "M20 20L4 4.00003M20 4L4.00002 20"
            buttonStyles = {styles.crossButton}
            svgStyles = {styles.crossIcon}
            onClick = {handleClick}/>
          </form>
        </Animation>
      </div>
  )
}

export default PopUp
