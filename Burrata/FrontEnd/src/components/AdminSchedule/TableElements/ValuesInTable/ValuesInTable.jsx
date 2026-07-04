import React, { useContext } from 'react'
import styles from './ValuesInTable.module.css'
import SvgIcon from '@/components/Svgs/SvgIcon'
import { Context } from '@/components/Context'
import { useOptions } from '@/hooks/useOptions'
import SvgButtonIcon from '@/components/Svgs/SvgButtonIcon'

function ValuesInTable(props) {

  const {
    weekDates,
    showClaims,
    allUsers,
    isEdit,
    customEdit,
    draftSchedule,
  } = useContext(Context)

  const {
    handleClick,
    all_users_to_show,
    handleEditChange,
  } = props

  const options = useOptions()
  console.log(options)

  return (
    <>
        {Object.keys(all_users_to_show).map((user, userIndex) => (
            <tr key={user}>
                <td>
                    <div className={styles.container}>
                        <div className={styles.svgsContainer}>
                            <div className={styles.infoIconContainer}>
                                <div className={styles.popUp}>
                                    <p>id:  {allUsers[user].unique_id_number}</p>
                                </div>
                                <div className={`${styles.infoIcon} ${styles.containerSVG}`}>
                                    <SvgIcon
                                    path = "M 25 2 C 12.309295 2 2 12.309295 2 25 C 2 37.690705 12.309295 48 25 48 C 37.690705 48 48 37.690705 48 25 C 48 12.309295 37.690705 2 25 2 z M 25 4 C 36.609824 4 46 13.390176 46 25 C 46 36.609824 36.609824 46 25 46 C 13.390176 46 4 36.609824 4 25 C 4 13.390176 13.390176 4 25 4 z M 25 11 A 3 3 0 0 0 22 14 A 3 3 0 0 0 25 17 A 3 3 0 0 0 28 14 A 3 3 0 0 0 25 11 z M 21 21 L 21 23 L 22 23 L 23 23 L 23 36 L 22 36 L 21 36 L 21 38 L 22 38 L 23 38 L 27 38 L 28 38 L 29 38 L 29 36 L 28 36 L 27 36 L 27 21 L 26 21 L 22 21 L 21 21 z"/>
                                </div>
                            </div>
                            <SvgButtonIcon
                            type = 'button'
                            onClick = {() => handleClick("edit", user)}
                            buttonStyles = {`${styles.containerSVG} ${styles.containerSVGButton} ${styles.editIconButton}`} 
                            svgButton = {styles.editIcon} 
                            viewBox = "0 0 24 24"
                            path = "M20.1497 7.93997L8.27971 19.81C7.21971 20.88 4.04971 21.3699 3.27971 20.6599C2.50971 19.9499 3.06969 16.78 4.12969 15.71L15.9997 3.84C16.5478 3.31801 17.2783 3.03097 18.0351 3.04019C18.7919 3.04942 19.5151 3.35418 20.0503 3.88938C20.5855 4.42457 20.8903 5.14781 20.8995 5.90463C20.9088 6.66146 20.6217 7.39189 20.0997 7.93997H20.1497Z"/>
                        </div>
                        <p>{`${userIndex+1}.`} {user}</p>
                            <SvgButtonIcon
                            type = 'button'
                            onClick = {() => handleClick("minus", user)}
                            viewBox = "0 0 50 50"
                            buttonStyles = {`${styles.containerSVG} ${styles.containerSVGButton}`}
                            path = "M 25 2 C 12.309295 2 2 12.309295 2 25 C 2 37.690705 12.309295 48 25 48 C 37.690705 48 48 37.690705 48 25 C 48 12.309295 37.690705 2 25 2 z M 25 4 C 36.609824 4 46 13.390176 46 25 C 46 36.609824 36.609824 46 25 46 C 13.390176 46 4 36.609824 4 25 C 4 13.390176 13.390176 4 25 4 z M 13 24 L 37 24 L 37 26 L 13 26 Z"/>
                    </div>
                </td>

                {weekDates?.map((date, dateIndex) => (
                    <td 
                    key={date}
                    className={`${isEdit && styles.cell} 
                                ${showClaims && all_users_to_show[user]?.[dateIndex] ? styles.claimCell : ''}`}>
                        { showClaims &&
                        <p> { all_users_to_show[user]?.[dateIndex] } </p> }
                        { isEdit && 
                        <select
                        className={styles.select}
                        id = {[...date, ...user]}
                        value={ all_users_to_show[user]?.[dateIndex] }
                        onChange={(e) => handleEditChange(user, dateIndex, e.target.value)}>
                        <option value={undefined}>{undefined}</option>
                        {options.map((option, _) => (
                            <option value={option}>{option}</option>
                        ))}
                        </select>}
                        {customEdit && 
                        <input className={styles.inputCell}
                        value={ draftSchedule[user]?.[dateIndex] }
                        onChange={(e) => handleEditChange(user, dateIndex, e.target.value)}
                        id = {[...date, ...user]}
                        />}
                        {(!showClaims && !isEdit && !customEdit) &&
                        <p> { all_users_to_show[user]?.[dateIndex] } </p>}
                    </td>
                ))}
            </tr>
        ))}
  </>
)}

export default ValuesInTable
