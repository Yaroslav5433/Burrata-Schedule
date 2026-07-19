import React, { useState } from 'react'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import pagestyles from '@/pages/pages.module.css'
import styles from './vacations.module.css'
import PaginationContainer from '@/components/PaginationContainer/PaginationContainer'
import VacationContainer from '@/components/VacationsContainer/VacationContainer'
import AddVacationContainer from '@/components/VacationsContainer/AddVacationContainer'
import SvgButtonIcon from '@/components/Svgs/SvgButtonIcon'
import { useVacations } from '@/hooks/vacationsPageHooks/useVacations'
import { useVacationsStore } from '@/hooks/vacationsPageHooks/stores/useVacationsStore'
import { useMobile } from '@/hooks/useMobile'


function Vacations() {

  const vacationsQuery = useVacations()

  const vacations = vacationsQuery.data ?? [];

  const addVacation = useVacationsStore(state => state.addVacation)
  const setAddVacation = useVacationsStore(state => state.setAddVacation)

  const isMobile = useMobile()

  return (
      <div className={pagestyles.app}>
        {!isMobile ? (
          <>
          <Header
        isAdmin = {true}/>
          <main className={styles.container}>
            <PaginationContainer
              paginationTitle = 'Vacations'>
                {vacations.map((vacation, id) => (
                  <VacationContainer
                  id = {id}
                  vacation = {vacation}/>))}
                {(addVacation &&
                <AddVacationContainer/>)}
              </PaginationContainer>
              <SvgButtonIcon
              onClick = {() => setAddVacation(true)}
              buttonStyles = {styles.svgButton}
              svgStyles = {styles.svg}
              viewBox = '0 0 50 50'
              path = "M 25 2 C 12.309295 2 2 12.309295 2 25 C 2 37.690705 12.309295 48 25 48 C 37.690705 48 48 37.690705 48 25 C 48 12.309295 37.690705 2 25 2 z M 25 4 C 36.609824 4 46 13.390176 46 25 C 46 36.609824 36.609824 46 25 46 C 13.390176 46 4 36.609824 4 25 C 4 13.390176 13.390176 4 25 4 z M 24 13 L 24 24 L 13 24 L 13 26 L 24 26 L 24 37 L 26 37 L 26 26 L 37 26 L 37 24 L 26 24 L 26 13 L 24 13 z"
              />
          </main>
        <Footer/>
        </>
        ): <p>This site doesn`t have a mobile version</p>} 
      </div>
  )
}

export default Vacations
