import Header from '@/components/Header/Header.jsx'
import Footer from '@/components/Footer/Footer.jsx'
import UserVerificationContainer from '@/components/CentralContainer/UserVerificationContainer/UserVerificationContainer.jsx'
import VerifiedUserContainer from '@/components/CentralContainer/VerifiedUser/VerifiedUserContainer/VerifiedUserContainer.jsx'
import pagestyles from '../pages.module.css'
import { useEffect } from 'react'
import { useUIStore } from '@/hooks/requestPageHooks/stores/useUIStore'
import { useClaimStore } from '@/hooks/requestPageHooks/stores/useClaimStore'

function Request() {

    const verificationPage = useUIStore(state => state.verificationPage);
    const setBlockClaims = useClaimStore(state => state.setBlockClaims)

    // useEffect(() => {
    //     const day = new Date().getDay();
    //     setBlockClaims(!(day === 1 || day === 2));
    // }, [verificationPage]);

    return (
        <div className = {pagestyles.app}>
            <Header />
                <main className={pagestyles.requestContainer}>
                    {verificationPage ? 
                    (<UserVerificationContainer/>) : 
                    (<VerifiedUserContainer/>)}
                </main>
            <Footer />
        </div>
    );
}
 
export default Request;