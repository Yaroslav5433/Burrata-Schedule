import styles from './button.module.css'
import { memo } from 'react'

function Button(props) {
    const {
        buttonText
    } = props

    return (
        <button className={styles.button}>
            {buttonText}
        </button>
    )
}

export default memo(Button)