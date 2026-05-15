import Header from '../../components/Header/Header.jsx'
import Footer from '../../components/Footer/Footer.jsx'
import RequestContainer from '../../components/RequestContainer/RequestContainer.jsx';
import { useState } from 'react';

function Request() {

    const [errorOnReq, setErrorOnReq] = useState(false);
    const [successOnReq, setSuccessOnReq] = useState(false);

    function handleRequest(form) {
        let res = form
        if (!res) {
            setErrorOnReq(!res)
            console.log("Request error setted")
        }
        setSuccessOnReq(!!res)
        console.log("Request success setted")
    }

    return (
        <div className = "app">
            <Header />
                <main>
                    <RequestContainer 
                    errorOnReq={errorOnReq}
                    successOnReq={successOnReq}
                    request={handleRequest}
                    />
                </main>
            <Footer />
        </div>
    );
 }
 
export default Request;