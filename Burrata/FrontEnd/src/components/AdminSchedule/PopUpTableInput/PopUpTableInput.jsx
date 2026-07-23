import React from 'react'
import PopUpForm from '@/components/PopUp/PopUpForm'
import TableWithDates from '@/components/TableWithDates/TableWithDates'
import TextField from '@/components/TextField/TextField'
import styles from './PopUpTableInput.module.css'
import Select from "react-select";
import { usePopupInputSubmit} from '@/hooks/homePageHooks/popupHooks/usePopupInputSubmit'
import { usePopupStore } from '@/hooks/homePageHooks/stores/usePopUpStore'
import { useScheduleView } from '@/hooks/homePageHooks/useScheduleView'
import { usePopupTableInput } from '@/hooks/homePageHooks/popupHooks/usePopupTableInput'

function PopUpTableInput(props) {

  const popup = usePopupStore(state => state.popup)
  const { all_workers_to_show } = useScheduleView()  

  const {
    dates,
    fillUpTitle,
    showLabel
  } = props

  const {
    onlyLong,
    setOnlyLong,
    onlyShort, 
    setOnlyShort, 
    handleTableInputChange,
    days
  } = usePopupTableInput() 

  const handlePopUpSubmit = usePopupInputSubmit()

  const handleSubmit = (e) => {
    handlePopUpSubmit(
        e,
        onlyShort,
        onlyLong,
        days,
        dates
    )
  } 

  const handleChange = (e) => {
    handleTableInputChange(e)
  }

  return (
    <PopUpForm
    title = {fillUpTitle}
    buttonText = 'Submit'
    handlePopUpSubmit = {handleSubmit}>
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
                  placeholder={date === 'Saturday' || date === 'Sunday' ? "X/Z/Y": "X/Y"}
                  inputMode="numeric"/>
                </td>
              ))}
              </tr>
        </TableWithDates>
        {popup === 'fillup' &&
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
