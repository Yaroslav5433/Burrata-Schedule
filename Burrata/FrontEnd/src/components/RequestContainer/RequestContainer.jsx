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
        errorOnAuth,
        errorOnReq,
        successOnReq,
        loginPage,
        username
    } = props

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
                    <h1>Hello, {username.user}</h1>
                    <p>Please, choose a claims:</p>
                    <ClaimsTable/>
                    <Button
                    type='submit'
                    buttonText='Sent a claim'/>
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