import React from 'react'
import styles from './Svg.module.css'

function SvgButtonIcon(props) {
  const {
    path,
    onClick,
    buttonStyles,
    svgStyles,
    viewBox="0 0 24 24"
  } = props

  return (
    <button onClick={onClick} className={`${buttonStyles} ${styles.workerContainerButton}`}>
        <svg className = {`${svgStyles} ${styles.button_icon}`} viewBox={viewBox} fill="none">
            <path d = {path}/>
        </svg>
    </button>
  )
}

export default SvgButtonIcon
