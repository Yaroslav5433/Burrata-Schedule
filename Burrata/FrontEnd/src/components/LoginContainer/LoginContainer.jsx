import TextField from '../TextField/TextField.jsx'
import Button from '../Button/Button.jsx'
import styles from './loginContainer.module.css'
import { useState } from 'react'

function LoginContainer(props) {
    const {
        logIn,
        errorOnAuth
    } = props

    const [form, setForm] = useState({
        login: '',
        password: ''
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
        const res = await logIn(form)
    }

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

export default LoginContainer