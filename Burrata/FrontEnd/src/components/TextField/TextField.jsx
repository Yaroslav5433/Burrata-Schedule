import { Context } from '@/components/Context.js'
import styles from './textField.module.css'
import { useContext, useState, forwardRef } from 'react'

const TextField = forwardRef((props, ref) => {
    const {
        label,
        placeholder='',
        type='text',
        inputMode='',
        value,
        onChange,
        name,
        onKeyDown,
        tableStyle,
        onBlur,
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

    return (
        <div className={styles.fieldContainer}>
            <label className={styles.fieldLabel}>
                {label}

                <input 
            name={name}
            type={type}
            value={value}
            placeholder={placeholder}
            onKeyDown={onKeyDown}
            ref={ref}
            inputMode={inputMode}
            className={`
                ${styles.fieldInput} ${tableStyle}
                ${blurred && (value?.length > 0) ? styles.fieldInputOnBlur : ''}
                ${errorOnAuth || errorOnReq ? styles.fieldInputOnError: ''}`}
            onBlur={handleBlur}
            onChange={onChange}/>
            </label>
        </div>
    )
})

export default TextField 