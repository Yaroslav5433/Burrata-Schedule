import styles from './footer.module.css'
import { memo } from 'react'

function Footer () {
    return (
        <footer className={styles.footer}>
            <p className={styles.rights}>Ⓒ  2026 Burrata Italiana. All rights reserved</p>
        </footer>
    )
}

export default memo(Footer)