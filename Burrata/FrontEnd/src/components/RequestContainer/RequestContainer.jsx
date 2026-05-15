import TextField from '../TextField/TextField.jsx'
import Button from '../Button/Button.jsx'
import styles from './requestContainer.module.css'
import { useState } from 'react'

function RequestContainer(props) {
    const {
        logIn,
        request,
        errorOnAuth,
        errorOnReq,
        successOnReq,
        loginPage
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
        request(form)
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
                {successOnReq && (
                    <p>Code that should appear on success request</p>
                )}
                {console.log({successOnReq})}
            </form>
    )
}

export default RequestContainer