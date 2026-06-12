import React from 'react'
import styles from './Svg.module.css'

function SvgButtonIcon(props) {
  const {
    path,
    onClick
  } = props

  return (
    <button onClick={onClick} className={styles.workerContainerButton}>
        <svg className = {styles.button_icon} viewBox="0 0 24 24" fill="none">
            <path d = {path}/>
        </svg>
    </button>
  )
}

export default SvgButtonIcon
