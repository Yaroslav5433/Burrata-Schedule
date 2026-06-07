import styles from './button.module.css'
import { memo } from 'react'

function Button(props) {
    const {
        buttonText,
        buttonStyle,
        isCurrent,
        type,
        name, 
        value
    } = props

    return (
        <button 
        className={`${styles.button} ${buttonStyle} ${isCurrent}`}
        type = {type}
        name = {name}
        value = {value}>
            {buttonText}
        </button>
    )
}

export default memo(Button)