import React, { useContext, useState } from 'react'
import ClaimsTableForRequest from '@/components/CentralContainer/VerifiedUser/ClaimsTableForRequest/ClaimsTableForRequest.jsx'
import Button from '@/components/Button/Button.jsx'
import { Context } from '@/components/Context.js'
import Animation from '@/components/Animation/Animation.jsx'
import centralstyle from '@/components/CentralContainer/CentralContainer.module.css'
import TextField from '@/components/TextField/TextField'
import styles from './VerifiedUserContainer.module.css'

function VerifiedUserContainer(props) {

    const {
        userSavedClaims,
        blockClaims,
        setBlockClaims
    } = useContext(Context)

    const {
        userName,
        onSubmit,
        userMessage,
        setUserMessage
    } = props

    return (
        <Animation>
            <form className={centralstyle.container} onSubmit={onSubmit}>
                {!blockClaims ? 
                <>
                    <h1 className={styles.title}>{userName}</h1>
                    <div className={styles.container}>
                        {!(userSavedClaims.some(Boolean)) && (
                            <p className={styles.text}>Please, choose a claims:</p>
                        )}
                        <ClaimsTableForRequest/>
                    </div>
                    {!(userSavedClaims.some(Boolean)) && (
                        <>
                        <div className={styles.container}>
                        <p className={styles.text}>Write an additional complains</p>
                        <TextField
                        textFieldStyle = {styles.field}
                        textArea = {true}
                        value = {userMessage}
                        onChange = {(e) => setUserMessage(e.target.value)}
                        placeholder = 'Кали искам 7 почивни дни моля ти се...'/>
                        </div>
                        <Button
                        type='submit'
                        buttonText='Sent a claim'/>
                        </>
                    )}
                    {(userSavedClaims.some(Boolean)) && (
                        <>
                        <p className={styles.text}>Вашето съобщение: {userMessage}</p>
                        <p className="successMessage">You have been sent your claims!</p>
                        </>
                    )}
                </> :
                    <p>'Oops... it`s wednesday already'</p>}
            </form>
        </Animation>
        )
    }

export default VerifiedUserContainer
