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
    } = useContext(Context)

    const {
        userName,
        onSubmit,
        userMessage,
        setUserMessage
    } = props

    return (
        <Animation>
            <form className={centralstyle.central_container} onSubmit={onSubmit}>
                <h1>{userName}</h1>
                <div className={styles.choose_a_claim_container}>
                    {!(userSavedClaims.some(Boolean)) && (
                        <p>Please, choose a claims:</p>
                    )}
                    <ClaimsTableForRequest/>
                </div>
                {!(userSavedClaims.some(Boolean)) && (
                    <>
                    <div className={styles.write_a_complains_container}>
                    <p>Write an additional complains</p>
                    <TextField
                    textFieldStyle = {styles.request_text_field}
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
                    <p>Вашето съобщение: {userMessage}</p>
                    <p className="successMessage">You have been sent your claims!</p>
                    </>
                )}
            </form>
        </Animation>
        )
    }

export default VerifiedUserContainer
