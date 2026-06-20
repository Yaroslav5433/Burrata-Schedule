import Header from '@/components/Header/Header.jsx'
import Footer from '@/components/Footer/Footer.jsx'
import UserVerificationContainer from '@/components/CentralContainer/UserVerificationContainer/UserVerificationContainer.jsx'
import VerifiedUserContainer from '@/components/CentralContainer/VerifiedUser/VerifiedUserContainer/VerifiedUserContainer.jsx'
import { verify_user_request } from '@/api/requests'
import { save_user_claims_request } from '@/api/requests'
import { get_dates_request } from '@/api/requests';
import { useState } from 'react';
import { Context } from '@/components/Context.js';
import pagestyles from '../pages.module.css'
import { EMPTY_ARRAY_OF_SEVEN } from '@/utils/constants';
import { useNotification } from '@/components/ModalWindow/ModalWindow'


function Request() {

    const [errorOnReq, setErrorOnReq] = useState(false);

    const [verificationPage, setVerificationPage] = useState(true);

    const [userName, setUserName] = useState('');
    const [claimDates, setClaimDates] = useState([]);
    const [userSavedClaims, setUserSavedClaims] = useState([]);
    const [claimValues, setClaimValues] = useState(EMPTY_ARRAY_OF_SEVEN);

    const {showNotification} = useNotification();


    async function verifyUser(unique_user_id) {
        try {
            const userAndClaimsInfo = await verify_user_request(unique_user_id)

            if (!userAndClaimsInfo) {
                setErrorOnReq(true)
                return
            }

            const nextWeekDates = await get_dates_request()

            const [[ username, claims ]] = Object.entries(userAndClaimsInfo)

            setUserName(username)
            setUserSavedClaims(claims)
            setClaimDates(nextWeekDates["dates"]);

            setErrorOnReq(false)
            setVerificationPage(false)
        } catch {
            setErrorOnReq(true)
        }
    }


    async function sendAClaim(values) {
        try {
            await save_user_claims_request(values, userName)

            setUserSavedClaims(values)
        } catch {
            showNotification('Claims haven`t been sent', true)
        }
    }


    return (
        <div className = {pagestyles.app}>
            <Header />
                <main className={pagestyles.requestContainer}>
                    {verificationPage ? 
                    (<UserVerificationContainer
                    errorOnReq = {errorOnReq}
                    verifyUser = {verifyUser}/>) : 
                    <Context.Provider
                    value={{
                        userSavedClaims,
                        claimDates,
                        claimValues,
                        setClaimValues,
                    }}>
                        <VerifiedUserContainer
                        userName = {userName}
                        sendAClaim = {sendAClaim}/>
                    </Context.Provider>}
                </main>
            <Footer />
        </div>
    );
}
 
export default Request;