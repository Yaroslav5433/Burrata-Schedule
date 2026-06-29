import styles from './header.module.css'
import Navbar from '@/components/Header/Navbar/Navbar'
import { memo } from 'react';

function Header (props) {
    const {
        isAdmin
    } = props

    return (
        isAdmin ? (
        <header className={styles.header}>
            <img src="/Logo.png"
            alt="Burrata-Shedule-logo"
            className={styles.logo}
            loading="lazy" 
            />
            <Navbar/>
        </header>
        ) : 
        <header className={`${styles.header}`}>
            <img src="/Logo.png"
            alt="Burrata-Shedule-logo"
            className={`${styles.logo}`}
            loading="lazy" 
            />
        </header>
    )
}

export default memo(Header)