import styles from './button.module.css'

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

export default Button