import styles from './header.module.css'

function Header () {
    return (
        <header className={styles.header}>
            <img src="/Logo.png"
            alt="Burrata-Shedule-logo"
            className={styles.logo}
            loading="lazy" 
            />
        </header>
    )
}

export default Header