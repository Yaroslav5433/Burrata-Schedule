import TextField from '../TextField/TextField.jsx'
import Button from '../Button/Button.jsx'
import styles from './loginContainer.module.css'
import { useState } from 'react'

function LoginContainer(props) {
    const {
        logIn
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

    const onSubmit = (event) => {
        event.preventDefault()
        logIn(form)
    }

    return (
        <form className={styles.container} onSubmit={onSubmit}>
            <h1 className={styles.loginTitle}>Authorization</h1>
            <TextField 
            name='login'
            label='Login'
            value={form.login}
            onChange={handleChange}/>
            <TextField 
            label='Password'
            type='password'
            name='password'
            value={form.password}
            onChange={handleChange}/>
            <Button 
            type='submit'
            buttonText='Sign In'/>
        </form>
    )
}

export default LoginContainer