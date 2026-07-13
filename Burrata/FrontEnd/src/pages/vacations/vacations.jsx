import React, { useState } from 'react'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import pagestyles from '@/pages/pages.module.css'
import styles from './vacations.module.css'
import PaginationContainer from '@/components/PaginationContainer/PaginationContainer'
import VacationContainer from '@/components/VacationsContainer/VacationContainer'
import AddVacationContainer from '@/components/VacationsContainer/AddVacationContainer'
import SvgButtonIcon from '@/components/Svgs/SvgButtonIcon'
import { useNotification } from '@/components/ModalWindow/ModalWindow'
import { useQuery } from '@tanstack/react-query'
import { useSaveVacation, useDeleteVacation } from '@/hooks/vacationsMutations'
import { Context } from '@/components/Context'
import { get_vacations, get_all_users_request } from '@/api/requests'


function Vacations() {

  const { showNotification } = useNotification()

  const vacationsQuery = useQuery({
    queryKey: ["vacations"],
    queryFn: () => get_vacations(),
    placeholderData: (prev) => prev,
    retry: 0
  })

  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: () => get_all_users_request(),
    placeholderData: (prev) => prev,
    retry: 0
});

  const vacations = vacationsQuery.data ?? [];
  const users = usersQuery.data ?? [];

  const getUsersForSelect = () => {
    const vacationsUsers = vacations.map(item => item.username)

    return Object.keys(users).filter(user => !vacationsUsers.includes(user))
  }

  const [dates, setDates] = useState('')
  const [username, setUsername] = useState('')
  const [addVacation, setAddVacation] = useState(false)

  const saveVacations = useSaveVacation()
  const deleteVacations = useDeleteVacation()

  const handleDeleteVacations = (current_username) => {
    deleteVacations.mutate(
      {
        username: current_username
      },
      {
        onError: () => {
          showNotification('Something went wrong', true)
        }
      }
    ) 
  }

  const handleSaveVacations = () => {
    saveVacations.mutate(
      {
        userId: userId,
        startDate: dates[0],
        endDate: dates[1]
      },
      {
        onSuccess: () => {
          setAddVacation(false)
        },
        onError: () => {
          showNotification('Fill up all fields', true)
        }
      }
    ) 
  }

  return (
    <Context.Provider
    value={{
      dates,
      setDates,
      username,
      setUsername,
      addVacation,
      setAddVacation,
      getUsersForSelect,
      handleDeleteVacations,
      handleSaveVacations}}>
      <div className={pagestyles.app}>
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
      </div>
    </Context.Provider>
  )
}

export default Vacations
