import styles from './PopUpForm.module.css'
import Button from '../Button/Button'
import React, { useContext, useState } from 'react'
import Animation from '../Animation/Animation'
import SvgButtonIcon from '../Svgs/SvgButtonIcon'
import { Context } from '../Context'
import { DAYS_OF_THE_WEEK } from '@/utils/constants'

function PopUpForm(props) {
  const {
    setPopUpIsOpen,
    setDays,
    setUserTextName
  } = useContext(Context)

  const {
    children,
    title,
    buttonText,
    handlePopUpSubmit,
  } = props

  const handleClick = () => {
    setPopUpIsOpen(null)
    setUserTextName('')
  }

  return (
      <div className = {styles.overlay}>
        <Animation>
          <form className={styles.container} onSubmit={(e) => handlePopUpSubmit(e)}>
            <h2
            className={styles.title}>{title}</h2>
            {children}
            <Button
            type = 'submit'
            buttonText = {buttonText}/>
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

export default PopUpForm
