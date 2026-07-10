import React, { useContext, useEffect } from 'react'
import PopUpForm from '@/components/PopUp/PopUpForm'
import TableWithDates from '@/components/TableWithDates/TableWithDates'
import TextField from '@/components/TextField/TextField'
import styles from './PopUpTableInput.module.css'
import { Context } from '@/components/Context'
import { demandsInputValidation, getAllFreeWorkers } from '@/utils/utils'
import { useNotification } from '@/components/ModalWindow/ModalWindow'
import { fill_up_schedule_request } from '@/api/requests'
import { useSaveDefaultShifts } from '@/hooks/defaultShiftsMutations'

function PopUpTableInput(props) {

  const {
    dates,
    fillUpTitle,
    showLabel
  } = props

  const {
    workers,
    draftSchedule,
    setPopUpIsOpen,
    setLoading,
    setDraftSchedule,
    days,
    setDays,
    popUpIsOpen,
    defaultShifts
  } = useContext(Context)

  const { showNotification } = useNotification()
  const saveDefaultShifts = useSaveDefaultShifts()

  useEffect(() => {
    if (
        (popUpIsOpen === 'fillup' || popUpIsOpen === 'editallusers') &&
        defaultShifts &&
        !Object.values(days).some(Boolean)
    ) {
        setDays(structuredClone(defaultShifts));
    }
}, [popUpIsOpen, defaultShifts]);

  const handleChange = (e) => {
    let input = e.target.value

    input = input.replace(/[^0-9/]/g, "")

    setDays(prev => ({
      ...prev,
      [e.target.name]: input
  }))
  }

  const handlePopUpSubmit = async (e) => {
    e.preventDefault();

    if (popUpIsOpen === 'fillup') {
      const onlyWorkersDraftSchedule = Object.fromEntries(
        Object.keys(workers).map(name => [
            name,
            draftSchedule[name] ?? workers[name]
        ])
      ) 
    
      const inputIsValid = demandsInputValidation(
          days,
          getAllFreeWorkers(onlyWorkersDraftSchedule))

      if (inputIsValid['isValid'] === false) {
          showNotification(inputIsValid['message'], true)
          return
      }

      setPopUpIsOpen(false)

      try {
          setLoading(true)
          const res = await fill_up_schedule_request(onlyWorkersDraftSchedule, days, dates)
          setDraftSchedule(res['schedule'])
      } catch (error) {
          showNotification(error.message, true)
      } finally {
          setLoading(false)
      }
    }

    if (popUpIsOpen === 'editallusers') {
      saveDefaultShifts.mutate({
        shifts: days
      }, {
        onSuccess: () => {
          showNotification('Default settings have been saved')
        },
        onError: () => {
          showNotification('Error while saving', true)
        },
      })
    }
}

  return (
    <PopUpForm
    title = {fillUpTitle}
    buttonText = 'Submit'
    handlePopUpSubmit = {handlePopUpSubmit}>
      <TableWithDates
            dates = {dates}>
              <tr className={styles.row}>
              {dates?.map((date, i) => (
                <td className={styles.rowElement} key={date}>
                  <TextField
                  textFieldStyle = {styles.input}
                  onChange = {handleChange}
                  label = {showLabel && Object.keys(days)[i]}
                  name = {Object.keys(days)[i]}
                  value = {Object.values(days)[i]}
                  placeholder="X/Y"
                  inputMode="numeric"/>
                </td>
              ))}
              </tr>
        </TableWithDates>
    </PopUpForm>
  )
}

export default PopUpTableInput
