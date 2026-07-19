import styles from './PopUpForm.module.css'
import Button from '../Button/Button'
import React from 'react'
import Animation from '../Animation/Animation'
import SvgButtonIcon from '../Svgs/SvgButtonIcon'
import { usePopupStore } from '@/hooks/homePageHooks/stores/usePopUpStore'
import { useUserStore } from '@/hooks/homePageHooks/stores/useUserStore'

function PopUpForm(props) {

  const closePopup = usePopupStore(state => state.closePopup)
  const setUserTextName = useUserStore(state => state.setUserTextName)

  const {
    children,
    title,
    buttonText,
    handlePopUpSubmit,
  } = props

  const handleClick = () => {
    closePopup()
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
