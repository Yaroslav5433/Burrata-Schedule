import Header from '@/components/Header/Header.jsx'
import Footer from '@/components/Footer/Footer.jsx'
import AdminAuthorizationContainer from '@/components/CentralContainer/AdminAuthorizationContainer/AdminAuthorizationContainer.jsx'
import { login_admin_request } from '@/api/requests';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Context } from '@/components/Context.js';
import pagestyles from '@/pages/pages.module.css'


function Login() {

    const navigate = useNavigate()

    const [errorOnAuth, setErrorOnAuth] = useState(false);

    async function loginAdmin(form) {
        try {
            const token = await login_admin_request(form)

            if (token) {
                navigate("/", {replace: true}) 
                return
            }
        } catch {
                setErrorOnAuth(true)
            }
        }

   return (
    <Context.Provider
    value={{
        errorOnAuth,
        loginAdmin
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