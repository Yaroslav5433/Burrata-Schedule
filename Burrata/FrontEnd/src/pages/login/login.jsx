import Header from '../../components/Header/Header.jsx'
import Footer from '../../components/Footer/Footer.jsx'
import LoginContainer from '../../components/LoginContainer/LoginContainer.jsx';
import logIn from '../../utils/auth.js';

function Login() {

   return (
    <div className = "app">
        <Header />
            <main>
                <LoginContainer logIn={logIn}/>
            </main>
        <Footer />
    </div>
   );
}

export default Login;