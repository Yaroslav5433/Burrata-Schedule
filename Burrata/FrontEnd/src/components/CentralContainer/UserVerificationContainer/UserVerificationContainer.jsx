import React, { useState } from 'react'
import TextField from '@/components/TextField/TextField.jsx'
import Button from '@/components/Button/Button.jsx'
import Animation from '@/components/Animation/Animation.jsx'
import centralstyle from '@/components/CentralContainer/CentralContainer.module.css'

function UserVerificationContainer(props) {

    const {
        errorOnReq,
        verifyUser
    } = props
    
    const [id, setId] = useState('')

    async function onSubmit(event) {
        event.preventDefault()
        await verifyUser(id)
    }

    return (
        <Animation>
            <form className={centralstyle.central_container} onSubmit={onSubmit}>
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
        </Animation>
        )
    }

export default UserVerificationContainer
