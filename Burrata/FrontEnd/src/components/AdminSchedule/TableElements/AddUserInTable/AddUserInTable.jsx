import React from 'react'
import TextField from '@/components/TextField/TextField'
import styles from './AddUserInTable.module.css'
import SvgIcon from '@/components/Svgs/SvgIcon'
import { EMPTY_ARRAY_OF_SEVEN } from '@/utils/constants'

function AddUserInTable(props) {

  const {
    addUser,
    setAddUser,
    userTextName,
    setUserTextName,
    handleRequest,
    inputRef,
    handleClick,
    icon_name,
    is_trainee
  } = props

  return (
    <tr>
        {addUser.state && (is_trainee ===addUser.is_trainee) ?
        <td>
            <div className={styles.userTextContainer}>
                <TextField 
                    value = {userTextName} 
                    textFieldStyle = {styles.userText}
                    ref = {inputRef}
                    onBlur = {() => {
                        setAddUser({'state': false, 'user': ''})
                        setUserTextName('')
                    }}
                    onChange = {(e) => setUserTextName(e.target.value)}
                    onKeyDown = {(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            handleRequest(is_trainee)
                        }
                    }}/>
            </div>
        </td> :
        <td className={styles.iconWrapper}>
            <button onClick={() => handleClick(icon_name)} className={styles.plusButton}>
                <SvgIcon
                path = "M 25 2 C 12.309295 2 2 12.309295 2 25 C 2 37.690705 12.309295 48 25 48 C 37.690705 48 48 37.690705 48 25 C 48 12.309295 37.690705 2 25 2 z M 25 4 C 36.609824 4 46 13.390176 46 25 C 46 36.609824 36.609824 46 25 46 C 13.390176 46 4 36.609824 4 25 C 4 13.390176 13.390176 4 25 4 z M 24 13 L 24 24 L 13 24 L 13 26 L 24 26 L 24 37 L 26 37 L 26 26 L 37 26 L 37 24 L 26 24 L 26 13 L 24 13 z"/>
            </button>
        </td> }
        {EMPTY_ARRAY_OF_SEVEN.map((_, j) => (
        <td key={j}></td>
        ))}
    </tr>
  )
}

export default AddUserInTable
