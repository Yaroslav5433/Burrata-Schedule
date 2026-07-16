import React, {useState } from 'react'
import TextField from '@/components/TextField/TextField.jsx'
import Button from '@/components/Button/Button.jsx'
import Animation from '@/components/Animation/Animation.jsx'
import centralstyle from '@/components/CentralContainer/CentralContainer.module.css'
import styles from './UserVerificationContainer.module.css'
import { useVerifyUser } from '@/hooks/requestPageHooks/useVerifyUser'
import { useUIStore } from '@/hooks/requestPageHooks/stores/useUIStore'

function UserVerificationContainer() {

    const errorOnReq = useUIStore(state => state.errorOnReq)

    const [id, setId] = useState('')

    const { verifyUser } = useVerifyUser();

    async function onSubmit(event) {
        event.preventDefault()
        verifyUser(id)
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
