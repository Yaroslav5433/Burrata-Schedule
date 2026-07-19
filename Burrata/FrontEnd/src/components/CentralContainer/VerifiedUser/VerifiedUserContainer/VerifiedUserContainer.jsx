import React from 'react'
import ClaimsTableForRequest from '@/components/CentralContainer/VerifiedUser/ClaimsTableForRequest/ClaimsTableForRequest.jsx'
import Button from '@/components/Button/Button.jsx'
import Animation from '@/components/Animation/Animation.jsx'
import centralstyle from '@/components/CentralContainer/CentralContainer.module.css'
import TextField from '@/components/TextField/TextField'
import styles from './VerifiedUserContainer.module.css'
import { useSaveUserClaims } from '@/hooks/requestPageHooks/useSaveUserClaims'
import { useUserStore } from '@/hooks/requestPageHooks/stores/useUserStore'
import { useClaimStore } from '@/hooks/requestPageHooks/stores/useClaimStore'
import { useNotification } from '@/components/ModalWindow/ModalWindow'

function VerifiedUserContainer() {

    const userName = useUserStore(state => state.userName)
    const userMessage = useUserStore(state => state.userMessage)
    const setUserMessage = useUserStore(state => state.setUserMessage)
    const userSavedClaims = useUserStore(state => state.userSavedClaims)
    const blockClaims = useClaimStore(state => state.blockClaims)
    const claimValues = useClaimStore(state => state.claimValues)

    const {showNotification} = useNotification();

    const {
        mutate: saveClaims
    } = useSaveUserClaims();

    const onSubmit = (event) => {
        event.preventDefault();
    
        if (!claimValues.some(Boolean)) {
            showNotification('Изберете поне 1 претенция', true);
            return;
        }

        saveClaims({
            claims: claimValues
        });
    };

    return (
        <Animation>
            <form className={centralstyle.container} onSubmit={onSubmit}>
                {!blockClaims ? 
                <>
                    <h1 className={styles.title}>{userName}</h1>
                    <div className={styles.container}>
                        {!(userSavedClaims.some(Boolean)) && (
                            <p className={styles.text}>Моля, изберете претенции:</p>
                        )}
                        <ClaimsTableForRequest/>
                    </div>
                    {!(userSavedClaims.some(Boolean)) && (
                        <>
                        <div className={styles.container}>
                        <p className={styles.text}>Напишете допълнително съобщение</p>
                        <TextField
                        textFieldStyle = {styles.field}
                        textArea = {true}
                        value = {userMessage}
                        onChange = {(e) => setUserMessage(e.target.value)}
                        placeholder = 'Ако може...'/>
                        </div>
                        <Button
                        type='submit'
                        buttonText='Изпрати'/>
                        </>
                    )}
                    {(userSavedClaims.some(Boolean)) && (
                        <>
                        <p className={styles.text}>Вашето съобщение: {userMessage}</p>
                        <p className="successMessage">Успешно изпратихте претенциите</p>
                        </>
                    )}
                </> :
                    <p className={styles.blockMessage}>Претенциите може да се пращат само понеделник и вторник</p>}
            </form>
        </Animation>
        )
    }

export default VerifiedUserContainer
