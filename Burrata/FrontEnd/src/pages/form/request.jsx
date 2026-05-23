import Header from '../../components/Header/Header.jsx'
import Footer from '../../components/Footer/Footer.jsx'
import RequestContainer from '../../components/RequestContainer/RequestContainer.jsx';
import { verification } from '../../utils/verification.js';
import { claiming } from '../../utils/claiming.js';
import { useState } from 'react';
import { Context } from '../../components/Context.js';

function Request() {

    const [errorOnReq, setErrorOnReq] = useState(false);
    const [claimsPage, setclaimsPage] = useState(false);
    const [verificationPage, setVerificationPage] = useState(true);
    const [userName, setUserName] = useState('');
    const [claimDates, setClaimDates] = useState(Array(7).fill(undefined));
    const [userHasClaims, setUserHasClaims] = useState(false);
    const [userSavedClaims, setUserSavedClaims] = useState([]);
    const [claimValues, setClaimValues] = useState(Array(7).fill(undefined));

    async function handleRequest(unique_user_id) {
        const userAndClaimsInfo = await verification(unique_user_id)
        if (!userAndClaimsInfo) {
            setErrorOnReq(true)
            setclaimsPage(false)
            return
        }
        setVerificationPage(!userAndClaimsInfo)
        const { user, user_saved_claims, dates } = userAndClaimsInfo
        
        if (Object.keys(user_saved_claims).length > 0) {
            setUserHasClaims(true)
            setUserSavedClaims(user_saved_claims)
        }
        setErrorOnReq(false)    
        setclaimsPage(true)
        setUserName(user)
        setClaimDates(dates);
    }

    async function sendAClaim(values, dates) {
        const claimValuesAsObject = Object.fromEntries(
            [...dates].map((char, i) => [char, values[i]])
        );
        setUserSavedClaims(claimValuesAsObject)
        let res = await claiming(claimValuesAsObject, userName)
        if (!res) {
            console.log("Error", error)
            return
        }
    }


    return (
        <Context.Provider
        value={{
            claimDates,
            userHasClaims,
            userSavedClaims,
            errorOnReq,
            claimValues,
            setClaimValues,
            userName,
            setUserHasClaims,
            handleRequest,
            sendAClaim,
            setUserSavedClaims
        }}>
            <div className = "app">
            <Header />
                <main>
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