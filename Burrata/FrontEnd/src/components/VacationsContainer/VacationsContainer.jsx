import React, { useState } from 'react'
import PaginationContainer from '../PaginationContainer/PaginationContainer'
import styles from './VacationsContainer.module.css'
import SvgButtonIcon from '../Svgs/SvgButtonIcon'
import { useQuery } from '@tanstack/react-query'
import { get_vacations } from '@/api/requests'
import { Calendar } from 'primereact/calendar';
import Button from '../Button/Button'

function VacationsContainer() {

  const vacationsQuery = useQuery({
    queryKey: ["vacations"],
    queryFn: () => get_vacations(),
    placeholderData: (prev) => prev
  })

  const vacations = vacationsQuery.data ?? [];

  const [dates, setDates] = useState('')
  const [username, setUsername] = useState('')
  const [addVacation, setAddVacation] = useState(false)

  return (
    <>
      <PaginationContainer
      paginationTitle = 'Vacations'>
        {vacations.map((vacation, id) => (
          <div key={id} className={styles.pagination_element_container}>
            <div className={styles.pagination_element_content}>
              <div className={styles.pagination_element_info}>
                <p>{vacation.username}</p>
                <time>{new Date(vacation.start_date).toLocaleDateString()} - {new Date(vacation.end_date).toLocaleDateString()}</time>
              </div>
              <SvgButtonIcon
              buttonStyles = {styles.svg_button_element}
              svgStyles = {styles.svg_element}
              viewBox = '0 0 50 50'
              path = "M 25 2 C 12.309295 2 2 12.309295 2 25 C 2 37.690705 12.309295 48 25 48 C 37.690705 48 48 37.690705 48 25 C 48 12.309295 37.690705 2 25 2 z M 25 4 C 36.609824 4 46 13.390176 46 25 C 46 36.609824 36.609824 46 25 46 C 13.390176 46 4 36.609824 4 25 C 4 13.390176 13.390176 4 25 4 z M 13 24 L 37 24 L 37 26 L 13 26 Z"
              />
            </div>
          </div>))}
        {(addVacation &&
        <div className={styles.pagination_element_container}>
          <p>Username:</p>
          <p>Vacation Period:</p>
          <Calendar value={dates} onChange={(e) => setDates(e.value)} selectionMode="range" readOnlyInput hideOnRangeSelection />
          <div className={styles.buttons_pagination_element_container}>
            <Button
            buttonText = 'Save'
            buttonStyle = {styles.button_pagination_element}
            />
            <Button
            buttonText = 'Cancel'
            buttonStyle = {styles.button_pagination_element}
            />
          </div>
        </div>)}
      </PaginationContainer>
      <SvgButtonIcon
      onClick = {() => setAddVacation(true)}
      buttonStyles = {styles.svg_button_element}
      svgStyles = {styles.svg_element}
      viewBox = '0 0 50 50'
      path = "M 25 2 C 12.309295 2 2 12.309295 2 25 C 2 37.690705 12.309295 48 25 48 C 37.690705 48 48 37.690705 48 25 C 48 12.309295 37.690705 2 25 2 z M 25 4 C 36.609824 4 46 13.390176 46 25 C 46 36.609824 36.609824 46 25 46 C 13.390176 46 4 36.609824 4 25 C 4 13.390176 13.390176 4 25 4 z M 24 13 L 24 24 L 13 24 L 13 26 L 24 26 L 24 37 L 26 37 L 26 26 L 37 26 L 37 24 L 26 24 L 26 13 L 24 13 z"
      />
    </>
  )
}

export default VacationsContainer
