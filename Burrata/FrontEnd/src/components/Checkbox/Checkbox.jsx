import React from 'react'
import styles from './checkbox.module.css'

function Checkbox(props) {
  const {
    checkboxText,
    checked,
    onChange
  } = props

  console.log('checked', checked)

  return (
    <div className={styles.checkboxWrapper}>
      <label htmlFor="cbk1-65">
        <input 
        type="checkbox" 
        id="cbk1-65"
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
