import { Context } from '@/components/Context.js'
import styles from './textField.module.css'
import { useContext, useState, forwardRef } from 'react'

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
        textArea = false
    } = props

    const {
        errorOnAuth,
        errorOnReq
    } = useContext(Context)

    const [blurred, setBlurred] = useState(false)

    const handleBlur = (e) => {
        setBlurred(true);

        if (onBlur) {
            onBlur(e)
        }
    } 

    const commonProps = {
        name,
        value,
        placeholder,
        onKeyDown,
        onBlur: handleBlur,
        onChange,
        className: `
            ${textFieldStyle} ${styles.fieldInput}
            ${blurred && (value?.length > 0) ? styles.fieldInputOnBlur : ''}
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