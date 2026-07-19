import Header from '@/components/Header/Header.jsx'
import Footer from '@/components/Footer/Footer.jsx'
import AdminAuthorizationContainer from '@/components/CentralContainer/AdminAuthorizationContainer/AdminAuthorizationContainer.jsx'
import pagestyles from '@/pages/pages.module.css'
import { useMobile } from '@/hooks/useMobile'


function Login() {

    const isMobile = useMobile()

    return (
        <div className = {pagestyles.app}>
            {!isMobile ? (
                <>
                <Header />
                    <main className={pagestyles.requestContainer}>
                        <AdminAuthorizationContainer/>
                    </main>
                <Footer />
                </>
            ): <p>This site doesn`t have a mobile version</p>}
        </div>
    );
}

export default Login;