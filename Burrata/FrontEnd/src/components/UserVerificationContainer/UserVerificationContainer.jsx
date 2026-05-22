import React, { useContext, useState } from 'react'
import { Context } from '../Context.js'
import TextField from '../TextField/TextField.jsx'
import Button from '../Button/Button.jsx'

function UserVerificationContainer() {

    const {
        errorOnReq,
        handleRequest
    } = useContext(Context)
    
    const [id, setId] = useState('')

    async function onSubmit(event) {
        event.preventDefault()
        await handleRequest(id)
    }

    return (
        <form className="container" onSubmit={onSubmit}>
            <h1>Sent a claim</h1>
            <TextField 
            name='ID'
            label='ID Code'
            value={id}
            onChange={(e) => setId(e.target.value)}/>
            <Button 
            type='submit'
            buttonText='Verify me'/>
            {errorOnReq && (
                <p className="errorMessage">Incorrect ID</p>
            )}
        </form>
        )
    }

export default UserVerificationContainer
