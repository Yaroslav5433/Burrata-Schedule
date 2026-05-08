import Header from '../../components/Header/Header.jsx'
import Footer from '../../components/Footer/Footer.jsx'
import LoginContainer from '../../components/LoginContainer/LoginContainer.jsx';
import auth from '../../utils/auth.js';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useState } from 'react';

function Login() {

    const navigate = useNavigate()
    const [loading, setLoading] = useState(true);

    async function handleLogin(form) {
        await auth.logIn(form)

        navigate("/", {replace: true}) 
    }

   return (
    <div className = "app">
        <Header />
            <main>
                <LoginContainer logIn={handleLogin}/>
            </main>
        <Footer />
    </div>
   );
}

export default Login;