import Header from '@/components/Header/Header.jsx'
import Footer from '@/components/Footer/Footer.jsx'
import AdminAuthorizationContainer from '@/components/CentralContainer/AdminAuthorizationContainer/AdminAuthorizationContainer.jsx'
import { login_admin_request_handler } from '@/utils/login_admin_handler.js';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Context } from '@/components/Context.js';
import pagestyles from '@/pages/pages.module.css'


function Login() {

    const navigate = useNavigate()

    const [errorOnAuth, setErrorOnAuth] = useState(false);

    async function login_admin(form) {
        const token = await login_admin_request_handler(form)
        if (token) {
            navigate("/", {replace: true}) 
            return
        }
        setErrorOnAuth(true)
        console.log("Login Error setted")
    }

   return (
    <Context.Provider
    value={{
        errorOnAuth,
        login_admin
    }}>
        <div className = {pagestyles.app}>
        <Header />
            <main className={pagestyles.requestContainer}>
                <AdminAuthorizationContainer/>
            </main>
        <Footer />
    </div>
    </Context.Provider>
   );
}

export default Login;