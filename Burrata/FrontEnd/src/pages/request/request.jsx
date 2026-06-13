import Header from '@/components/Header/Header.jsx'
import Footer from '@/components/Footer/Footer.jsx'
import UserVerificationContainer from '@/components/CentralContainer/UserVerificationContainer/UserVerificationContainer.jsx'
import VerifiedUserContainer from '@/components/CentralContainer/VerifiedUser/VerifiedUserContainer/VerifiedUserContainer.jsx'
import { verify_user_request_handler } from '@/utils/verify_user_handler.js';
import { save_user_claims_request_handler } from '@/utils/save_user_claims_handler.js'
import { get_dates_request_handler } from '@/utils/get_dates_handler.js';
import { useState } from 'react';
import { Context } from '@/components/Context.js';
import pagestyles from '../pages.module.css'


function Request() {

    const [errorOnReq, setErrorOnReq] = useState(false);
    const [errorOnClaimsSaving, setErrorOnClaimsSaving] = useState(false);
    const [verificationPage, setVerificationPage] = useState(true);
    const [userName, setUserName] = useState('');
    const [claimDates, setClaimDates] = useState([]);
    const [userSavedClaims, setUserSavedClaims] = useState([]);
    const [claimValues, setClaimValues] = useState(Array(7).fill(""));


    async function verify_user(unique_user_id) {
        const userAndClaimsInfo = await verify_user_request_handler(unique_user_id)
        if (!userAndClaimsInfo) {
            setErrorOnReq(true)
            return
        }
        setErrorOnReq(false)

        const nextWeekDates = await get_dates_request_handler()
        setClaimDates(nextWeekDates["dates"]);

        setVerificationPage(false)
        
        const [ username , user_saved_claims ] = Object.entries(userAndClaimsInfo)[0];
        setUserName(username)
        
        if ((userSavedClaims.length) === 0) {
            setUserSavedClaims(user_saved_claims)
        }
    }


    async function send_a_claim(values) {
        const res = await save_user_claims_request_handler(values, userName)
        console.log(res)
        if (!res) {
            setErrorOnClaimsSaving(true)
            return
        }
        setUserSavedClaims(claimValues)
        setErrorOnClaimsSaving(false)
    }


    return (
        <div className = {pagestyles.app}>
            <Header />
                <main className={pagestyles.requestContainer}>
                    {verificationPage ? 
                    (<UserVerificationContainer
                    errorOnReq = {errorOnReq}
                    verify_user = {verify_user}/>) : 
                    <Context.Provider
                    value={{
                        userSavedClaims,
                        claimDates,
                        claimValues,
                        setClaimValues,
                    }}>
                        <VerifiedUserContainer
                        userName = {userName}
                        send_a_claim = {send_a_claim}
                        errorOnClaimsSaving = {errorOnClaimsSaving}/>
                    </Context.Provider>}
                </main>
            <Footer />
        </div>
    );
}
 
export default Request;