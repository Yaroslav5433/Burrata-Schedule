import React from 'react'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import pagestyles from '@/pages/pages.module.css'
import styles from './vacations.module.css'
import VacationsContainer from '@/components/VacationsContainer/VacationsContainer'

function Vacations() {
  console.log('vacations redners')

  return (
    <div className={pagestyles.app}>
      <Header
      isAdmin = {true}/>
        <main className={styles.vacations_page_container}>
          <VacationsContainer/>
        </main>
      <Footer/>
    </div>
  )
}

export default Vacations
