import React, { useContext, useState } from 'react'
import { Context } from '../Context.js'
import TextField from '../TextField/TextField.jsx'
import Button from '../Button/Button.jsx'

function AdminAuthorizationContainer() {

    const {
        errorOnAuth,
        handleLogin
    } = useContext(Context)

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
        await handleLogin(form)
    }

    return (
        <form className="container" onSubmit={onSubmit}>
            <h1>Authorization</h1>
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
            {errorOnAuth && (
                <p className="errorMessage">Incorrect Login or Password</p>
            )}
        </form>
        )
    }

export default AdminAuthorizationContainer
