import React, { useContext } from 'react'
import ClaimsTableForRequest from '@/components/CentralContainer/VerifiedUser/ClaimsTableForRequest/ClaimsTableForRequest.jsx'
import Button from '@/components/Button/Button.jsx'
import { Context } from '@/components/Context.js'
import Animation from '@/components/Animation/Animation.jsx'
import centralstyle from '@/components/CentralContainer/CentralContainer.module.css'

function VerifiedUserContainer(props) {

    const {
        claimValues,
        userSavedClaims,
    } = useContext(Context)

    const {
        userName,
        send_a_claim,
        errorOnClaimsSaving,
    } = props

    async function onSubmit(event) {
        event.preventDefault()
        await send_a_claim(claimValues)
    }

    return (
        <Animation>
            <form className={centralstyle.central_container} onSubmit={onSubmit}>
                <h1>{userName}</h1>
                {!(userSavedClaims.some(Boolean)) && (
                    <p>Please, choose a claims:</p>
                )}
                <ClaimsTableForRequest/>
                {!(userSavedClaims.some(Boolean)) && (
                    <Button
                    type='submit'
                    buttonText='Sent a claim'/>
                )}
                {(userSavedClaims.some(Boolean)) && (
                    <p className="successMessage">You have been sent your claims!</p>
                )}
                {errorOnClaimsSaving && (
                    <p className="errorMessage">Something went wrong. Claims have not been sent</p>
                )}
            </form>
        </Animation>
        )
    }

export default VerifiedUserContainer
