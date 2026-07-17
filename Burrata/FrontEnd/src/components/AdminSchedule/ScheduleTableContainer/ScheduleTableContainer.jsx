import React from 'react'
import styles from './ScheduleTableContainer.module.css'
import ScheduleTable from '@/components/AdminSchedule/ScheduleTable/ScheduleTable'
import Checkbox from '@/components/Checkbox/Checkbox'
import SvgButtonIcon from '@/components/Svgs/SvgButtonIcon'
import Spinner from '@/components/Spinner/Spinner'
import IsEditButtons from './ButtonsContainers/IsEditButtons'
import CustomEditButtons from './ButtonsContainers/CustomEditButtons'
import BasicButtons from './ButtonsContainers/BasicButtons'
import { useScheduleStore } from '@/hooks/homePageHooks/stores/useScheduleStore'
import { useSaveClaims, useSaveSchedule } from '@/hooks/homePageHooks/useSave'
import { usePopupStore } from '@/hooks/homePageHooks/stores/usePopUpStore'
import { useUIStore } from '@/hooks/requestPageHooks/stores/useUIStore'
import { useEditClick } from '@/hooks/homePageHooks/useEditClick'

function ScheduleTableContainer() {

  const showClaims = useScheduleStore(state => state.showClaims)
  const showVacations = useScheduleStore(state => state.showVacations)
  const isEdit = useScheduleStore(state => state.isEdit)
  const setShowVacations = useScheduleStore(state => state.setShowVacations)
  const setShowClaims = useScheduleStore(state => state.setShowClaims)
  const setDateStep = useScheduleStore(state => state.setDateStep)
  const openPopup = usePopupStore(state => state.openPopup)
  const loading = useUIStore(state => state.loading)
  const customEdit = useScheduleStore(state => state.customEdit)

  const handleSaveSchedule = useSaveSchedule()
  const handleSaveClaims = useSaveClaims()

  const handleClick = (step) => {
    setDateStep(prev => prev + step)
  }

  const handleEditSettings = () => {
    openPopup('editallusers')
  }

  const handleEditClick = useEditClick(action)

  return (
    <div className={styles.tableMainContainer}>
      {(!isEdit && !customEdit) && 
      <>
      <SvgButtonIcon
      buttonStyles = {styles.IconArrowButton}
      path = "M15 18L9 12L15 6 M23 18L17 12L23 6"
      onClick = {() => handleClick(-7)}/>
      <SvgButtonIcon
      buttonStyles = {styles.IconArrowButton}
      path = "M15 18L9 12L15 6"
      onClick = {() => handleClick(-1)}/>
      </>}
      <form className={styles.container}>
          <div className={styles.topLine}>
              <span 
              className={styles.tableName}>
              <h2>Schedule</h2>
              <SvgButtonIcon
                type = 'button' 
                onClick = {() => handleEditSettings()}
                buttonStyles = {styles.editIconButton} 
                svgButton = {styles.editIcon} 
                viewBox = "0 0 24 24"
                path = "M20.1497 7.93997L8.27971 19.81C7.21971 20.88 4.04971 21.3699 3.27971 20.6599C2.50971 19.9499 3.06969 16.78 4.12969 15.71L15.9997 3.84C16.5478 3.31801 17.2783 3.03097 18.0351 3.04019C18.7919 3.04942 19.5151 3.35418 20.0503 3.88938C20.5855 4.42457 20.8903 5.14781 20.8995 5.90463C20.9088 6.66146 20.6217 7.39189 20.0997 7.93997H20.1497Z"/>
              </span>
              {(!isEdit && !customEdit) &&
              <div className={styles.checkboxContainer}>
                <Checkbox
                checkboxText = 'Show Vacations'
                checked = {showVacations}
                onChange = {(e) => {
                  setShowVacations(e.target.checked);
                  if (e.target.checked) setShowClaims(false);
              }}/>
                <Checkbox
                checkboxText = 'Show Claims'
                checked = {showClaims}
                onChange = {(e) => {
                  setShowClaims(e.target.checked);
                  if (e.target.checked) setShowVacations(false);
              }}/>
              </div>}
          </div>
          <div className={styles.loading}>
              <div className = {loading ? styles.blurred : ""}>
                <ScheduleTable/>
              </div>
              {loading && (
                  <div className = {styles.loadingOverlay}>
                      <Spinner/>
                  </div>
              )}
          </div>
          <div className={styles.bottomLine}>
            {isEdit &&
            <IsEditButtons
            handleEditClick = {handleEditClick}
            handleSaveSchedule = {handleSaveSchedule}/>
            }
            {customEdit &&
            <CustomEditButtons
            handleEditClick = {handleEditClick}
            handleSaveSchedule = {handleSaveSchedule}/>}
            {(!isEdit && !customEdit) &&
            <BasicButtons
            handleEditClick = {handleEditClick}
            handleSaveClaims = {handleSaveClaims}/>}
          </div>
      </form>
      {(!isEdit && !customEdit) && 
      <>
      <SvgButtonIcon
      buttonStyles = {styles.IconArrowButton}
      path = "M9 18L15 12L9 6"
      onClick = {() => handleClick(+1)}/>
      <SvgButtonIcon
      path = "M9 18L15 12L9 6 M17 18L23 12L17 6"
      buttonStyles = {styles.IconArrowButton}
      onClick = {() => handleClick(+7)}/>
      </>}
    </div>
  )
}

export default ScheduleTableContainer
