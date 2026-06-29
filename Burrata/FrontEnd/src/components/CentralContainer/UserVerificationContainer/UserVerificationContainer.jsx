import React, { useContext, useState } from 'react'
import TextField from '@/components/TextField/TextField.jsx'
import Button from '@/components/Button/Button.jsx'
import Animation from '@/components/Animation/Animation.jsx'
import centralstyle from '@/components/CentralContainer/CentralContainer.module.css'
import styles from './UserVerificationContainer.module.css'
import { Context } from '@/components/Context'

function UserVerificationContainer(props) {

    const {
        verifyUser
    } = props

    const {
        errorOnReq
    } = useContext(Context)
    
    const [id, setId] = useState('')

    async function onSubmit(event) {
        event.preventDefault()
        await verifyUser(id)
    }

    return (
        <Animation>
            <form className={`${styles.container} ${centralstyle.container}`} onSubmit={onSubmit}>
                <h1 className={styles.title}>Sent a claim</h1>
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
