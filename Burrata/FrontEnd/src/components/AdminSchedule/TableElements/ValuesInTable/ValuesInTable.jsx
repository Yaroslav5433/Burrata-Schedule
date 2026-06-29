import React, { useContext } from 'react'
import styles from './ValuesInTable.module.css'
import SvgIcon from '@/components/Svgs/SvgIcon'
import { Context } from '@/components/Context'

function ValuesInTable(props) {

  const {
    weekDates,
    showClaims,
    allUsers,
    isEdit,
    customEdit,
    draftSchedule
  } = useContext(Context)

  const {
    handleClick,
    all_users_to_show,
    handleEditChange,
  } = props

  return (
    <>
        {Object.keys(all_users_to_show).map((user, userIndex) => (
            <tr key={user}>
                <td>
                    <div className={styles.container}>
                        <div className={`${styles.containerButton} ${styles.infoIcon}`}>
                            <div className={styles.popUp}>
                                <p>id:  {allUsers[user].unique_id_number}</p>
                            </div>
                            <SvgIcon
                            path = "M 25 2 C 12.309295 2 2 12.309295 2 25 C 2 37.690705 12.309295 48 25 48 C 37.690705 48 48 37.690705 48 25 C 48 12.309295 37.690705 2 25 2 z M 25 4 C 36.609824 4 46 13.390176 46 25 C 46 36.609824 36.609824 46 25 46 C 13.390176 46 4 36.609824 4 25 C 4 13.390176 13.390176 4 25 4 z M 25 11 A 3 3 0 0 0 22 14 A 3 3 0 0 0 25 17 A 3 3 0 0 0 28 14 A 3 3 0 0 0 25 11 z M 21 21 L 21 23 L 22 23 L 23 23 L 23 36 L 22 36 L 21 36 L 21 38 L 22 38 L 23 38 L 27 38 L 28 38 L 29 38 L 29 36 L 28 36 L 27 36 L 27 21 L 26 21 L 22 21 L 21 21 z"/>
                        </div>
                        <p>{`${userIndex+1}.`} {user}</p>
                        <button onClick={() => handleClick("minus", user)} type='button' className={styles.containerButton}>
                            <SvgIcon
                            path = "M 25 2 C 12.309295 2 2 12.309295 2 25 C 2 37.690705 12.309295 48 25 48 C 37.690705 48 48 37.690705 48 25 C 48 12.309295 37.690705 2 25 2 z M 25 4 C 36.609824 4 46 13.390176 46 25 C 46 36.609824 36.609824 46 25 46 C 13.390176 46 4 36.609824 4 25 C 4 13.390176 13.390176 4 25 4 z M 13 24 L 37 24 L 37 26 L 13 26 Z"/>
                        </button>
                    </div>
                </td>

                {weekDates?.map((date, dateIndex) => (
                    <td 
                    key={date}
                    className={showClaims && all_users_to_show[user]?.[dateIndex] ? styles.cell : ''}>
                        { showClaims &&
                        <p> { all_users_to_show[user]?.[dateIndex] } </p> }
                        { isEdit && 
                        <select
                        className={styles.select}
                        id = {[...date, ...user]}
                        value={ all_users_to_show[user]?.[dateIndex] }
                        onChange={(e) => handleEditChange(user, dateIndex, e.target.value)}>
                        <option value={undefined}>{undefined}</option>
                        <option value="X">X</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="D12">D12</option>
                        <option value="D10">D10</option>
                        </select>}
                        {customEdit && 
                        <input className={styles.valueCell}
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
