import React from 'react'
import { NavLink } from 'react-router-dom'
import styles from './Navbar.module.css'

function Navbar() {

    const pages = [
        { label: "Schedule", value: "schedule" },
        { label: "Vacations", value: "vacations" },
        { label: "Messages", value: "messages" }
      ];

    return (
    <div className={styles.container}>
        <nav className={styles.navbar}>
            <ul className={styles.list}>
                {pages.map(page =>(
                    <li key = {page.value} className={styles.item}>
                        <NavLink
                            to={`/admin/${page.value}`}
                            className={({ isActive }) =>
                            `${styles.link} ${
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
  )
}

export default Navbar
