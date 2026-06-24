import styles from './header.module.css'
import { NavLink } from 'react-router-dom';
import { memo, useState } from 'react';

function Header (props) {
    const {
        isAdmin
    } = props

    const pages = [
        { label: "Schedule", value: "schedule" },
        { label: "Vacations", value: "vacations" },
        { label: "Messages", value: "messages" }
      ];

    const [open, setOpen] = useState(false)

    return (
        isAdmin ? (
        <header className={`${styles.header} ${styles.header_admin}`}>
            <div className={styles.logo_container}>
                <img src="/Logo.png"
                alt="Burrata-Shedule-logo"
                className={`${styles.logo} ${styles.logo_admin}`}
                loading="lazy" 
                />
                <input 
                className='hidden'
                onChange={() => setOpen(!open)}
                checked={open}
                type="checkbox"/>
                <label className = {styles.burger_label}
                onClick={() => setOpen(!open)}>
                    <span className={styles.burger_lable_span}></span>
                </label>
            </div>
            <div className={styles.navbar_container}>
                <nav className={styles.navbar_items_container}>
                    <ul className={styles.navbar_items}>
                        {pages.map(page =>(
                            <li key = {page.value} className={styles.navbar_item}>
                                <NavLink
                                    to={`/admin/${page.value}`}
                                    className={({ isActive }) =>
                                    `${styles.navbar_item_link} ${
                                        isActive ? styles.current : ""
                                    }`
                                    }
                                >
                                    {page.label}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>

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