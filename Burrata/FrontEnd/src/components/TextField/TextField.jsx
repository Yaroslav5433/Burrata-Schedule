import { Context } from '@/components/Context.js'
import styles from './textField.module.css'
import { useContext, forwardRef } from 'react'

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
        textArea = false
    } = props

    const {
        errorOnAuth,
        errorOnReq
    } = useContext(Context)

    const commonProps = {
        name,
        value,
        placeholder,
        onKeyDown,
        onChange,
        className: `
        ${textFieldStyle} ${styles.fieldInput}
        ${errorOnAuth || errorOnReq ? styles.fieldInputOnError: ''}
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