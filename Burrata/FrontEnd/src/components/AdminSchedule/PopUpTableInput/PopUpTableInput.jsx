import React, { useState, useContext, useEffect } from 'react'
import PopUpForm from '@/components/PopUp/PopUpForm'
import TableWithDates from '@/components/TableWithDates/TableWithDates'
import TextField from '@/components/TextField/TextField'
import styles from './PopUpTableInput.module.css'
import { Context } from '@/components/Context'
import { demandsInputValidation, getAllFreeWorkers } from '@/utils/utils'
import { useNotification } from '@/components/ModalWindow/ModalWindow'
import { fill_up_schedule_request } from '@/api/requests'
import { useSaveDefaultShifts } from '@/hooks/defaultShiftsMutations'
import Select from "react-select";

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
    defaultShifts,
    all_workers_to_show
  } = useContext(Context)

  const [onlyShort, setOnlyShort] = useState([])
  const [onlyLong, setOnlyLong] = useState([])  

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

      const only_short = onlyShort.map(worker => worker.value)
      const only_long = onlyLong.map(worker => worker.value)

      setPopUpIsOpen(false)

      try {
          setLoading(true)
          const res = await fill_up_schedule_request(onlyWorkersDraftSchedule, days, dates, only_long, only_short)
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
        {popUpIsOpen === 'fillup' &&
        <div className={styles.specifyContainer}>
          <div className={styles.shiftContainer}>
              <p>Only Short</p>
              <Select
              isMulti
              classNamePrefix="worker-select"
              options={Object.keys(all_workers_to_show).map(worker => ({
                value: worker,
                label: worker,
              }))}
              onChange={setOnlyShort}
              styles={{
                control: (base) => ({
                  ...base,
                  backgroundColor: '#4b4a4a',
                  border: 0,
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
                  minWidth: '300px',
                  paddingBlock: '5px'
                }),
                multiValue: (base) => ({
                  ...base,
                  backgroundColor: '#FFFFFF'
                }),
                multiValueRemove: (base, state) => ({
                  ...base,
                  color: state.isFocused ? '#ff5555' : '#161414',
                  backgroundColor: 'transparent',
                
                  '&:hover': {
                    transitionDuration: '0.2s',
                    backgroundColor: 'transparent',
                    color: '#ff5555',
                  },
                }),
                menu: (base) => ({
                  ...base,
                  backgroundColor: '#4b4a4a',
                }),
                menuPortal: (base) => ({
                  ...base,
                  zIndex: 999,
                }),
                input: (base) => ({
                  ...base,
                  color: "#FFFFFF",
                  caretColor: "#FFFFFF", 
                }),
                dropdownIndicator: (base) => ({
                  ...base,
                  color: "#FFFFFF",
                }),
                clearIndicator: (base) => ({
                  ...base,
                  color: "#FFFFFF",
                }),
                option: (base, state) => ({
                  ...base,
                  backgroundColor: state.isFocused
                    ? "#555555"   
                    : "#4b4a4a",
                  color: "white",
                }),
                }}
            />
          </div>
          <div className={styles.shiftContainer}>
              <p>Only Long</p>
              <Select
              isMulti
              classNamePrefix="worker-select"
              options={Object.keys(all_workers_to_show).map(worker => ({
                value: worker,
                label: worker,
              }))}
              onChange={setOnlyLong}
              styles={{
                control: (base) => ({
                  ...base,
                  backgroundColor: '#4b4a4a',
                  border: 0,
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
                  minWidth: '300px',
                  paddingBlock: '5px'
                }),
                multiValue: (base) => ({
                  ...base,
                  backgroundColor: '#FFFFFF'
                }),
                multiValueRemove: (base, state) => ({
                  ...base,
                  color: state.isFocused ? '#ff5555' : '#161414',
                  backgroundColor: 'transparent',
                
                  '&:hover': {
                    transitionDuration: '0.2s',
                    backgroundColor: 'transparent',
                    color: '#ff5555',
                  },
                }),
                menu: (base) => ({
                  ...base,
                  backgroundColor: '#4b4a4a',
                }),
                menuPortal: (base) => ({
                  ...base,
                  zIndex: 999,
                }),
                input: (base) => ({
                  ...base,
                  color: "#FFFFFF",
                  caretColor: "#FFFFFF", 
                }),
                dropdownIndicator: (base) => ({
                  ...base,
                  color: "#FFFFFF",
                }),
                clearIndicator: (base) => ({
                  ...base,
                  color: "#FFFFFF",
                }),
                option: (base, state) => ({
                  ...base,
                  backgroundColor: state.isFocused
                    ? "#555555"   
                    : "#4b4a4a",
                  color: "white",
                }),
                }}
            />
          </div>
        </div>}
    </PopUpForm>
  )
}

export default PopUpTableInput
