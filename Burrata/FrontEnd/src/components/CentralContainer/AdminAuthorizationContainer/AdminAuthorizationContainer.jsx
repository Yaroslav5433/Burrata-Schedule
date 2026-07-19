import React, { useState } from 'react'
import TextField from '@/components/TextField/TextField.jsx'
import Button from '@/components/Button/Button.jsx'
import centralstyle from '@/components/CentralContainer/CentralContainer.module.css'
import style from './AdminAuthorizationContainer.module.css'
import { useLoginStore } from '@/hooks/loginHooks/useLoginStore'
import { useHandleLogin } from '@/hooks/loginHooks/useHandleLogin'

function AdminAuthorizationContainer() {

    const loginAdmin = useHandleLogin()
    const errorOnAuth = useLoginStore(state => state.errorOnAuth)

    const [form, setForm] = useState({
        login: '',
        password: '',
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
        await loginAdmin(form)
    }

    return (
        <form className={centralstyle.container} onSubmit={onSubmit}>
            <h1 className={style.title}>Authorization</h1>
            <TextField 
            name='login'
            label='Login'
            value={form.login}
            onChange={handleChange}
            error = {errorOnAuth}/>
            <TextField 
            label='Password'
            type='password'
            name='password'
            value={form.password}
            onChange={handleChange}
            error = {errorOnAuth}/>
            <Button 
            type='submit'
            buttonText='Sign In'/>
            {errorOnAuth && (
                <p className="errorMessage">Incorrect Login or Password</p>
            )}
        </form>
        )
    }

export default AdminAuthorizationContainer
