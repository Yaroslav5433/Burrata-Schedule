import React from 'react'
import PopUpForm from '@/components/PopUp/PopUpForm'
import styles from './PopUpEditUser.module.css'
import SvgButtonIcon from '@/components/Svgs/SvgButtonIcon'
import Checkbox from '@/components/Checkbox/Checkbox'
import { usePopupEditDraft } from '@/hooks/homePageHooks/popupHooks/usePopUpEditDraft'
import { usePopupEditSubmit } from '@/hooks/homePageHooks/popupHooks/usePopUpEditSubmit'
import { useUserStore } from '@/hooks/homePageHooks/stores/useUserStore'

function PopUpEditUser() {

  const userTextName = useUserStore(state => state.userTextName)

  const {
    totalMaxShiftDraft,
    availableShiftsValuesDraft,
    handleCheckChange,
    handleCount,
    days,
    shifts
  } = usePopupEditDraft();

  const handlePopUpSubmit = usePopupEditSubmit()

  const handleSubmit = (e) => {
    handlePopUpSubmit(
        e,
        totalMaxShiftDraft,
        availableShiftsValuesDraft
    )
  } 
  
  return (
    <PopUpForm
    title = {userTextName}
    buttonText = 'Submit'
    handlePopUpSubmit = {handleSubmit}>
      <table className={styles.table}>
        <thead>
          <tr>
            {Object.keys(totalMaxShiftDraft ?? {}).map((shift) => (
              <td key={shift}>{shift}</td>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {Object.entries(totalMaxShiftDraft ?? {}).map(([shift, value]) => (
              <td key={`${value}-${shift}`}>
                <div className={styles.totalMaxValueContainer}>
                  <SvgButtonIcon
                    type = 'button'
                    onClick = {() => handleCount(shift, 'minus')}
                    viewBox = "0 0 50 50"
                    buttonStyles = {styles.minusButton}
                    svgStyles = {styles.minusButtonSVG}
                    path = "M 25 2 C 12.309295 2 2 12.309295 2 25 C 2 37.690705 12.309295 48 25 48 C 37.690705 48 48 37.690705 48 25 C 48 12.309295 37.690705 2 25 2 z M 25 4 C 36.609824 4 46 13.390176 46 25 C 46 36.609824 36.609824 46 25 46 C 13.390176 46 4 36.609824 4 25 C 4 13.390176 13.390176 4 25 4 z M 13 24 L 37 24 L 37 26 L 13 26 Z"/>
                  {value}
                  <SvgButtonIcon
                  onClick={() => handleCount(shift, 'plus')}
                  buttonStyles={styles.plusButton}
                  svgStyles = {styles.plusButtonSVG}
                  viewBox = "0 0 50 50"
                  path = "M 25 2 C 12.309295 2 2 12.309295 2 25 C 2 37.690705 12.309295 48 25 48 C 37.690705 48 48 37.690705 48 25 C 48 12.309295 37.690705 2 25 2 z M 25 4 C 36.609824 4 46 13.390176 46 25 C 46 36.609824 36.609824 46 25 46 C 13.390176 46 4 36.609824 4 25 C 4 13.390176 13.390176 4 25 4 z M 24 13 L 24 24 L 13 24 L 13 26 L 24 26 L 24 37 L 26 37 L 26 26 L 37 26 L 37 24 L 26 24 L 26 13 L 24 13 z"/>
                </div>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
      <table className={styles.table}>
        <thead>
          <tr>
            <td></td>
            {days.map((day, dayId) => (
              <td key={dayId}>{day}</td>))}
          </tr>
        </thead>
        <tbody>
          {shifts.map((shift, shiftId) => (
            <tr key={shiftId}>
              <td>{shift}</td>

              {days.map((day, dayId) => (
                <td key={`${dayId}-${shiftId}`}>
                  <Checkbox
                  id = {`${dayId}-${shiftId}`}
                  checked = {availableShiftsValuesDraft[day][shift]}
                  onChange = {(e) => handleCheckChange(day, shift, e.target.checked)}/>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      
    </PopUpForm>
  )
}

export default PopUpEditUser
