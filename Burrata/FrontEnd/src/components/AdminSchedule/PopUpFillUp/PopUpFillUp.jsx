import React, { useContext } from 'react'
import PopUpForm from '@/components/PopUp/PopUpForm'
import TableWithDates from '@/components/TableWithDates/TableWithDates'
import TextField from '@/components/TextField/TextField'
import styles from './PopUpFillUp.module.css'
import { Context } from '@/components/Context'
import { demandsInputValidation, getAllFreeWorkers } from '@/utils/utils'
import { useNotification } from '@/components/ModalWindow/ModalWindow'
import { fill_up_schedule_request } from '@/api/requests'

function PopUpFillUp(props) {

  const {
    dates,
  } = props

  const {
    days,
    setDays,
    workers,
    draftSchedule,
    setPopUpIsOpen,
    setLoading,
    setDraftSchedule
  } = useContext(Context)

  const { showNotification } = useNotification()

  const handleChange = (e) => {
    let input = e.target.value

    input = input.replace(/[^0-9/]/g, "")

    setDays(prev => ({
      ...prev,
      [e.target.name]: input
  }))
  }

  const handlePopUpSubmit = async (e, demands) => {
    e.preventDefault();
    const onlyWorkersDraftSchedule = Object.fromEntries(
        Object.keys(workers).map(name => [
            name,
            draftSchedule[name] ?? workers[name]
        ])
    )
    
    const inputIsValid = demandsInputValidation(
        demands,
        getAllFreeWorkers(onlyWorkersDraftSchedule))

    if (inputIsValid['isValid'] === false) {
        showNotification(inputIsValid['message'], true)
        return
    }

    setPopUpIsOpen(false)
    setLoading(true)

    try {
        const res = await fill_up_schedule_request(onlyWorkersDraftSchedule, demands)
        setDraftSchedule(res['schedule'])
    } catch (error) {
        showNotification(error.message, true)
    } finally {
        setLoading(false)
    }
}

  return (
    <PopUpForm
    title = 'Auto Fill Up'
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
                  label = {Object.keys(days)[i]}
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

export default PopUpFillUp
