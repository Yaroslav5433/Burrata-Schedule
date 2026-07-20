import styles from './textField.module.css'
import { forwardRef } from 'react'

const TextField = forwardRef((props, ref) => {
    const {
        label,
        placeholder='',
        inputMode='',
        value,
        onChange,
        name,
        onKeyDown,
        textFieldStyle,
        onBlur,
        textArea = false,
        error = false,
        type,
    } = props

    const commonProps = {
        name,
        value,
        placeholder,
        onKeyDown,
        onChange,
        onBlur,
        type,
        className: `
        ${textFieldStyle} ${styles.fieldInput}
        ${error ? styles.fieldInputOnError: ''}
        `
    }

    return (
        <div className={styles.fieldContainer}>
            <label className={styles.fieldLabel}>
                {label}

            {textArea ? 
            <textarea {...commonProps} ref={ref} maxLength={200}/> : 
            <input {...commonProps} inputMode={inputMode} ref={ref} />}
                
            </label>
        </div>
    )
})

export default TextField 