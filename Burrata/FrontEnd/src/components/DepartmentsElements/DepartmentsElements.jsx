import React from 'react'
import styles from './DepartmentsElements.module.css'
import { NavLink } from "react-router-dom";

function DepartmentsElements() {

  const departments = [
    { label: "Bar", value: "bar" },
    { label: "Service", value: "service" },
    { label: "Hostess", value: "hostess" }
  ];

  return (
    <ul className={styles.container}>
      {departments.map(dep => (
        <li key={dep.value} className={styles.container_item}>
          <NavLink
            to={`/admin/schedule/${dep.value}`}
            className={({ isActive }) =>
              `${styles.container_item_link} ${
                isActive ? styles.container_item_link_is_current : ""
              }`
            }
          >
            {dep.label}
          </NavLink>
        </li>
      ))}
    </ul>
  );
}

export default DepartmentsElements
