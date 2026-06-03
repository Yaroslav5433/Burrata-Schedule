import Header from '../../components/Header/Header.jsx'
import Footer from '../../components/Footer/Footer.jsx'
import RequestContainer from '../../components/RequestContainer/RequestContainer.jsx';
import { verify_user_request_handler } from '../../utils/verify_user_handler.js';
import { save_user_claims_request_handler } from '../../utils/save_user_claims_handler.js'
import { get_dates_request_handler } from '../../utils/get_dates_handler.js';
import { useState } from 'react';
import { Context } from '../../components/Context.js';


function Request() {

    const [errorOnReq, setErrorOnReq] = useState(false);
    const [errorOnClaimsSaving, setErrorOnClaimsSaving] = useState(false);
    const [claimsPage, setclaimsPage] = useState(false);
    const [verificationPage, setVerificationPage] = useState(true);
    const [userName, setUserName] = useState('');
    const [claimDates, setClaimDates] = useState([]);
    const [userSavedClaims, setUserSavedClaims] = useState([]);
    const [claimValues, setClaimValues] = useState(Array(7).fill(""));


    async function verify_user(unique_user_id) {
        const userAndClaimsInfo = await verify_user_request_handler(unique_user_id)
        const nextWeekDates = await get_dates_request_handler()

        if (!userAndClaimsInfo) {
            setErrorOnReq(true)
            return
        }

        setVerificationPage(false)
        setclaimsPage(true)
        setErrorOnReq(false)
        
        const [ username , user_saved_claims ] = Object.entries(userAndClaimsInfo)[0];
        
        if ((userSavedClaims.length) === 0) {
            setUserSavedClaims(user_saved_claims)
        }

        setUserName(username)
        setClaimDates(nextWeekDates["dates"]);

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
        <Context.Provider
        value={{
            errorOnClaimsSaving,
            claimDates,
            userSavedClaims,
            errorOnReq,
            claimValues,
            setClaimValues,
            userName,
            verify_user,
            send_a_claim,
            setUserSavedClaims
        }}>
            <div className = "app">
            <Header />
                <main className='requestContainer'>
                    <RequestContainer 
                    claimsPage={claimsPage}
                    verificationPage={verificationPage}
                    />
                </main>
            <Footer />
        </div>
        </Context.Provider>
    );
}
 
export default Request;