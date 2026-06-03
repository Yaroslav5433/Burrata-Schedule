import React, { useContext } from 'react'
import ClaimsTableForRequest from '../ClaimsTableForRequest/ClaimsTableForRequest.jsx'
import Button from '../Button/Button'
import { Context } from '../Context.js'
import Animation from '../Animation/Animation.jsx'

function VerifiedUserContainer() {

    const {
        userName,
        send_a_claim,
        claimValues,
        userSavedClaims,
        errorOnClaimsSaving
    } = useContext(Context)

    async function onSubmit(event) {
        event.preventDefault()
        await send_a_claim(claimValues)
    }

    return (
        <Animation>
            <form className="container" onSubmit={onSubmit}>
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
