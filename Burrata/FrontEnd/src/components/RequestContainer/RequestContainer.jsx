import TextField from '../TextField/TextField.jsx'
import Button from '../Button/Button.jsx'
import styles from './requestContainer.module.css'
import { useState } from 'react'
import Animation from '../Animation/Animation.jsx'
import ClaimsTable from '../ClaimsTable/ClaimsTable.jsx'

function RequestContainer(props) {
    const {
        logIn,
        request,
        sendAClaim,
        errorOnAuth,
        errorOnReq,
        successOnReq,
        loginPage,
        username,
        claimDates,
        userHasClaims,
        setUserHasClaims,
        userSavedClaims
    } = props

    const [claimValues, setClaimValues] = useState(Array(7).fill(undefined));

    const [form, setForm] = useState({
        login: '',
        password: '',
        ID: ''
      })

    const handleChange = (e) => {
        const { name, value } = e.target
        
        setForm(prev => ({
            ...prev,
            [name]: value
        }))
    }

    async function onSubmit(event) {
        event.preventDefault()
        if (loginPage) {
            await logIn(form)
        }
        if (successOnReq) {
            await sendAClaim(claimValues, claimDates)
            setUserHasClaims(true)
        }
        request(form.ID)
    }

    if (loginPage) {
        return (
            <form className={styles.container} onSubmit={onSubmit}>
                <h1 className={styles.loginTitle}>Authorization</h1>
                <TextField 
                name='login'
                label='Login'
                value={form.login}
                onChange={handleChange}
                errorOnAuth={errorOnAuth}/>
                <TextField 
                label='Password'
                type='password'
                name='password'
                value={form.password}
                onChange={handleChange}
                errorOnAuth={errorOnAuth}/>
                <Button 
                type='submit'
                buttonText='Sign In'/>
                {errorOnAuth && (
                    <p className={styles.errorMessage}>Incorrect Login or Password</p>
                )}
            </form>
        )
    }

    if (successOnReq) {
        return (
            <Animation>
                <form className={styles.container} onSubmit={onSubmit}>
                    <h1>{username}</h1>
                    {!userHasClaims && (
                        <p>Please, choose a claims:</p>
                    )}
                    <ClaimsTable
                    claimValues={claimValues}
                    setClaimValues={setClaimValues}
                    claimDates={claimDates}
                    userHasClaims={userHasClaims}
                    userSavedClaims={userSavedClaims}/>
                    {!userHasClaims && (
                        <Button
                        type='submit'
                        buttonText='Sent a claim'/>
                    )}
                    {userHasClaims && (
                        <p className={styles.successMessage}>You have been sent your claims!</p>
                    )}
                </form>
            </Animation>
        )
    }
    
    return (
            <form className={styles.container} onSubmit={onSubmit}>
                <h1 className={styles.loginTitle}>Sent a claim</h1>
                <TextField 
                name='ID'
                label='ID Code'
                value={form.ID}
                onChange={handleChange}
                errorOnReq={errorOnReq}/>
                <Button 
                type='submit'
                buttonText='Verify me'/>
                {errorOnReq && (
                    <p className={styles.errorMessage}>Incorrect ID</p>
                )}
            </form>
    )
}

export default RequestContainer