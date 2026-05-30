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
        setUserSavedClaims
    } = useContext(Context)

    async function onSubmit(event) {
        event.preventDefault()
        await send_a_claim(claimValues)
        setUserSavedClaims(claimValues)
    }

    return (
        <Animation>
            <form className="container" onSubmit={onSubmit}>
                <h1>{userName}</h1>
                {userSavedClaims?.length === 0 && (
                    <p>Please, choose a claims:</p>
                )}
                <ClaimsTableForRequest/>
                {userSavedClaims?.length === 0 && (
                    <Button
                    type='submit'
                    buttonText='Sent a claim'/>
                )}
                {userSavedClaims?.length === 0 && (
                    <p className="successMessage">You have been sent your claims!</p>
                )}
            </form>
        </Animation>
        )
    }

export default VerifiedUserContainer
