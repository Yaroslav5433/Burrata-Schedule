import Header from '../../components/Header/Header.jsx'
import Footer from '../../components/Footer/Footer.jsx'
import RequestContainer from '../../components/RequestContainer/RequestContainer.jsx';
import { verify_user_request_handler } from '../../utils/verify_user_handler.js';
import { save_user_claims_request } from '../../api/requests.js';
import { useState } from 'react';
import { Context } from '../../components/Context.js';


function Request() {

    const [errorOnReq, setErrorOnReq] = useState(false);
    const [claimsPage, setclaimsPage] = useState(false);
    const [verificationPage, setVerificationPage] = useState(true);
    const [userName, setUserName] = useState('');
    const [claimDates, setClaimDates] = useState([]);
    const [userSavedClaims, setUserSavedClaims] = useState([]);
    const [claimValues, setClaimValues] = useState(Array(7).fill(undefined));


    async function verify_user(unique_user_id) {
        const userAndClaimsInfo = await verify_user_request_handler(unique_user_id)

        if (!userAndClaimsInfo) {
            setErrorOnReq(true)
            return
        }

        setVerificationPage(false)
        setclaimsPage(true)
        setErrorOnReq(false)
        
        const { user, user_saved_claims } = userAndClaimsInfo
        
        if ((user_saved_claims).length > 0) {
            setUserSavedClaims(user_saved_claims)
        }

        setUserName(user)
        setClaimDates(dates);
    }
    

    async function send_a_claim(values, dates) {
        const claimValuesAsObject = Object.fromEntries(
            [...dates].map((char, i) => [char, values[i]])
        );
        setUserSavedClaims(claimValuesAsObject)

        await save_user_claims_request(claimValuesAsObject, userName)
        }


    return (
        <Context.Provider
        value={{
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