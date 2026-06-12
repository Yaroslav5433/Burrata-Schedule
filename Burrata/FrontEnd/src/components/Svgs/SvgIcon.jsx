import React from 'react'
import styles from './Svg.module.css'

function SvgIcon(props) {
    const {
        path
    } = props

    return (
    <svg className={styles.icon} viewBox="0 0 50 50">
        <path d={path} />
    </svg>
    )
}

export default SvgIcon
