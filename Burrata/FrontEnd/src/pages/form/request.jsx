import Header from '../../components/Header/Header.jsx'
import Footer from '../../components/Footer/Footer.jsx'
import RequestContainer from '../../components/RequestContainer/RequestContainer.jsx';
import { verification } from '../../utils/verification.js';
import { claiming } from '../../utils/claiming.js';
import { useState } from 'react';

function Request() {

    const [errorOnReq, setErrorOnReq] = useState(false);
    const [successOnReq, setSuccessOnReq] = useState(false);
    const [userName, setUserName] = useState('');
    const [claimDates, setClaimDates] = useState(Array[undefined]);
    const [userHasClaims, setUserHasClaims] = useState(false);
    const [userSavedClaims, setUserSavedClaims] = useState('');

    async function handleRequest(unique_user_id) {
        const userAndClaimsInfo = await verification(unique_user_id)
        if (!userAndClaimsInfo) {
            setErrorOnReq(!userAndClaimsInfo)
            setSuccessOnReq(!!userAndClaimsInfo)
            return
        }
        
        const { user, user_saved_claims, dates } = userAndClaimsInfo
        
        if (Object.keys(user_saved_claims).length > 0) {
            setUserHasClaims(true)
            setUserSavedClaims(user_saved_claims)
        }
        setErrorOnReq(!user)    
        setSuccessOnReq(!!user)
        setUserName(user)
        setClaimDates(dates);
    }

    async function sendAClaim(values, dates) {
        const claimValuesAsObject = Object.fromEntries(
            [...dates].map((char, i) => [char, values[i]])
        );

        let res = await claiming(claimValuesAsObject, userName)
        if (!res) {
            console.log("Error", error)
            return
        }
    }


    return (
        <div className = "app">
            <Header />
                <main>
                    <RequestContainer 
                    errorOnReq={errorOnReq}
                    successOnReq={successOnReq}
                    request={handleRequest}
                    sendAClaim={sendAClaim}
                    claimDates={claimDates}
                    username={userName}
                    userHasClaims={userHasClaims}
                    setUserHasClaims={setUserHasClaims}
                    userSavedClaims={userSavedClaims}
                    />
                </main>
            <Footer />
        </div>
    );
 }
 
export default Request;