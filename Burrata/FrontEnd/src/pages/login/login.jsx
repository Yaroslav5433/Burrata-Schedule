import Header from '../../components/Header/Header.jsx'
import Footer from '../../components/Footer/Footer.jsx'
import RequestContainer from '../../components/RequestContainer/RequestContainer.jsx';
import auth from '../../utils/auth.js';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Context } from '../../components/Context.js';


function Login() {

    const navigate = useNavigate()

    const [errorOnAuth, setErrorOnAuth] = useState(false);

    async function handleLogin(form) {
        const token = await auth.logIn(form)
        if (token) {
            navigate("/", {replace: true}) 
            return
        }
        setErrorOnAuth(!token)
        console.log("Login Error setted")
    }

   return (
    <Context.Provider
    value={{
        errorOnAuth,
        handleLogin
    }}>
        <div className = "app">
        <Header />
            <main className='requestContainer'>
                <RequestContainer 
                loginPage={true}/>
            </main>
        <Footer />
    </div>
    </Context.Provider>
   );
}

export default Login;