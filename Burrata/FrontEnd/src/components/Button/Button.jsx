import styles from './button.module.css'
import { memo } from 'react'

function Button(props) {
    const {
        buttonText,
        buttonStyle,
        isCurrent
    } = props

    return (
        <button className={`${styles.button} ${buttonStyle} ${isCurrent}`}>
            {buttonText}
        </button>
    )
}

export default memo(Button)