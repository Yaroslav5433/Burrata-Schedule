import styles from './button.module.css'
import { memo } from 'react'

function Button(props) {
    const {
        buttonText,
        buttonStyle,
        isCurrent,
        type,
        name, 
        value,
        onClick
    } = props

    return (
        <button 
        className={`${buttonStyle} ${styles.button} ${isCurrent}`}
        type = {type}
        name = {name}
        value = {value}
        onClick={onClick}>
            {buttonText}
        </button>
    )
}

export default memo(Button)