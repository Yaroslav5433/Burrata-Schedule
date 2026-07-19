import React from 'react'
import SvgButtonIcon from '@/components/Svgs/SvgButtonIcon'
import styles from './VacationsContainer.module.css'
import { Context } from '@/components/Context'
import { useHandleDeleteVacations } from '@/hooks/vacationsPageHooks/useHandleEditVacations'

function VacationContainer(props) {

  const {
    id,
    vacation
  } = props

  const handleDeleteVacations = useHandleDeleteVacations()

  return (
    <div key={id} className={styles.container}>
        <div className={styles.content}>
            <div className={styles.info}>
                <p>{vacation.username}</p>
                <time>{new Date(vacation.start_date).toLocaleDateString()} - {new Date(vacation.end_date).toLocaleDateString()}</time>
            </div>
            <SvgButtonIcon
            onClick = {() => handleDeleteVacations(vacation.username)}
            buttonStyles = {styles.svgButton}
            svgStyles = {styles.svg}
            viewBox = '0 0 50 50'
            path = "M 25 2 C 12.309295 2 2 12.309295 2 25 C 2 37.690705 12.309295 48 25 48 C 37.690705 48 48 37.690705 48 25 C 48 12.309295 37.690705 2 25 2 z M 25 4 C 36.609824 4 46 13.390176 46 25 C 46 36.609824 36.609824 46 25 46 C 13.390176 46 4 36.609824 4 25 C 4 13.390176 13.390176 4 25 4 z M 13 24 L 37 24 L 37 26 L 13 26 Z"
            />
        </div>
    </div>
  )
}

export default VacationContainer
