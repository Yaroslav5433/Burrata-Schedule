import React, { useContext } from 'react'
import ClaimsTableForRequest from '../ClaimsTableForRequest/ClaimsTableForRequest.jsx'
import Button from '../Button/Button'
import { Context } from '../Context.js'
import Animation from '../Animation/Animation.jsx'

function VerifiedUserContainer() {

    const {
        userName,
        userHasClaims,
        setUserHasClaims,
        sendAClaim,
        claimValues,
        claimDates,
    } = useContext(Context)

    async function onSubmit(event) {
        event.preventDefault()
        await sendAClaim(claimValues, claimDates)
        setUserHasClaims(true)
    }

    return (
        <Animation>
            <form className="container" onSubmit={onSubmit}>
                <h1>{userName}</h1>
                {!userHasClaims && (
                    <p>Please, choose a claims:</p>
                )}
                <ClaimsTableForRequest/>
                {!userHasClaims && (
                    <Button
                    type='submit'
                    buttonText='Sent a claim'/>
                )}
                {userHasClaims && (
                    <p className="successMessage">You have been sent your claims!</p>
                )}
            </form>
        </Animation>
        )
    }

export default VerifiedUserContainer
