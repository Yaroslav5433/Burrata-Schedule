import { Context } from '../Context.js'
import styles from './textField.module.css'
import { useContext, useState } from 'react'

function TextField( props ) {
    const {
        label,
        placeholder='',
        type='text',
        value,
        onChange,
        name,
        onKeyDown,
        tableStyle,
        onBlur
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
            </label>

            <input 
            name={name}
            type={type}
            value={value}
            placeholder={placeholder}
            onKeyDown={onKeyDown}
            className={`
                ${styles.fieldInput} ${tableStyle}
                ${blurred && (value?.length > 0) ? styles.fieldInputOnBlur : ''}
                ${errorOnAuth || errorOnReq ? styles.fieldInputOnError: ''}`}
            onBlur={handleBlur}
            onChange={onChange}/>
        </div>
    )
}

export default TextField 