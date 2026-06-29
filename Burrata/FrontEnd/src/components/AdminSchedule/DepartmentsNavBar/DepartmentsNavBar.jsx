import React from 'react'
import styles from './DepartmentsNavBar.module.css'
import { NavLink } from 'react-router-dom';
import { memo } from 'react'

function DepartmentsNavBar() {

  const departments = [
    { label: "Service", value: "service" },
    { label: "Bar", value: "bar" },
    { label: "Hostess", value: "hostess" },
    { label: "Kitchen", value: "kitchen"}
  ];

  return (
    <nav className={styles.navigation}>
      <ul className={styles.list}>
        {departments.map(dep => (
          <li key={dep.value} className={styles.item}>
            <NavLink
              to={`/admin/schedule/${dep.value}`}
              className={({ isActive }) =>
                `${styles.link} ${
                  isActive ? styles.current : ""
                }`
              }
            >
              {dep.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default memo(DepartmentsNavBar)
