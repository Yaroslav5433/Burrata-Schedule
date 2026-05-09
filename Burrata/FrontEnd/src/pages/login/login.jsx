import Header from '../../components/Header/Header.jsx'
import Footer from '../../components/Footer/Footer.jsx'
import LoginContainer from '../../components/LoginContainer/LoginContainer.jsx';
import auth from '../../utils/auth.js';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function Login() {

    const navigate = useNavigate()

    const [errorOnAuth, setErrorOnAuth] = useState(false);

    async function handleLogin(form) {
        let res = await auth.logIn(form)
        setErrorOnAuth(!res)
        console.log("Error setted")
        if (res) {
            navigate("/", {replace: true}) 
        }
    }

   return (
    <div className = "app">
        <Header />
            <main>
                <LoginContainer 
                logIn={handleLogin}
                errorOnAuth={errorOnAuth}/>
            </main>
        <Footer />
    </div>
   );
}

export default Login;