import Header from '../../components/Header/Header.jsx'
import Footer from '../../components/Footer/Footer.jsx'
import RequestContainer from '../../components/RequestContainer/RequestContainer.jsx';
import auth from '../../utils/auth.js';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function Login() {

    const navigate = useNavigate()

    const [errorOnAuth, setErrorOnAuth] = useState(false);

    async function handleLogin(form) {
        let res = await auth.logIn(form)
        if (res) {
            navigate("/", {replace: true}) 
            return
        }
        setErrorOnAuth(!res)
        console.log("Login Error setted")
    }

   return (
    <div className = "app">
        <Header />
            <main>
                <RequestContainer 
                logIn={handleLogin}
                errorOnAuth={errorOnAuth}
                loginPage={true}/>
            </main>
        <Footer />
    </div>
   );
}

export default Login;