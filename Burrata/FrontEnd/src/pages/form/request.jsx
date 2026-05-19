import Header from '../../components/Header/Header.jsx'
import Footer from '../../components/Footer/Footer.jsx'
import RequestContainer from '../../components/RequestContainer/RequestContainer.jsx';
import { verification } from '../../utils/verification.js';
import { useState } from 'react';

function Request() {

    const [errorOnReq, setErrorOnReq] = useState(false);
    const [successOnReq, setSuccessOnReq] = useState(false);
    const [userName, setUserName] = useState('');

    async function handleRequest(unique_user_id) {
        let res = await verification(unique_user_id)
        if (!res) {
            setErrorOnReq(!res)
            setSuccessOnReq(!!res)
            return
        }
        setErrorOnReq(!res)
        setSuccessOnReq(!!res)
        setUserName(res)
    }

    return (
        <div className = "app">
            <Header />
                <main>
                    <RequestContainer 
                    errorOnReq={errorOnReq}
                    successOnReq={successOnReq}
                    request={handleRequest}
                    username={userName}
                    />
                </main>
            <Footer />
        </div>
    );
 }
 
export default Request;