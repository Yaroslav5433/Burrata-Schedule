import React from 'react'
import styles from './checkbox.module.css'

function Checkbox(props) {
  const {
    checkboxText,
    checked,
    onChange,
    id
  } = props

  return (
    <div className={styles.checkboxWrapper}>
      <label htmlFor={id}>
        <input 
        type="checkbox" 
        id={id}
        checked={checked}
        onChange={onChange}/>
        <span className = {styles.cbx}>
            <svg width="12px" height="11px" viewBox="0 0 12 11">
                <polyline points="1 6.29411765 4.5 10 11 1"></polyline>
            </svg>
        </span>
        
        <span>{checkboxText}</span>
      </label>
    </div>
  )
}

export default Checkbox
