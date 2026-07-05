import Header from '@/components/Header/Header.jsx'
import Footer from '@/components/Footer/Footer.jsx'
import UserVerificationContainer from '@/components/CentralContainer/UserVerificationContainer/UserVerificationContainer.jsx'
import VerifiedUserContainer from '@/components/CentralContainer/VerifiedUser/VerifiedUserContainer/VerifiedUserContainer.jsx'
import { get_shifts_values, get_total_max, verify_user_request } from '@/api/requests'
import { save_user_claims_request } from '@/api/requests'
import { get_dates_request } from '@/api/requests';
import { useState, useEffect, useMemo } from 'react';
import { Context } from '@/components/Context.js';
import pagestyles from '../pages.module.css'
import { EMPTY_ARRAY_OF_SEVEN } from '@/utils/constants';
import { useNotification } from '@/components/ModalWindow/ModalWindow'
import { useQuery } from '@tanstack/react-query'


function Request() {

    const [errorOnReq, setErrorOnReq] = useState(false);

    const [verificationPage, setVerificationPage] = useState(true);

    const [userName, setUserName] = useState('');
    const [userSavedClaims, setUserSavedClaims] = useState([]);
    const [userMessage, setUserMessage] = useState('')
    const [claimValues, setClaimValues] = useState(EMPTY_ARRAY_OF_SEVEN);
    const [mobile, setMobile] = useState(window.innerWidth < 1268)
    const [combinedShifts, setCombinedShifts] = useState(false)

    const {showNotification} = useNotification();

    const verifyUser = async (unique_user_id) => {
        try {
            const userAndClaimsInfo = await verify_user_request(unique_user_id)

            const { username, claims, message } = userAndClaimsInfo

            if (!!claims) {
                setUserSavedClaims(claims)
            }
            if (!!message) {
                setUserMessage(message)
            }
            setUserName(username)

            setErrorOnReq(false)
            setVerificationPage(false)
        } catch {
            setErrorOnReq(true)
        }
    }

    const datesQuery = useQuery({
        queryKey: ["dates"],
        queryFn: () => get_dates_request(),
        placeholderData: (prev) => prev,
    });

    const availableShiftsValuesQuery = useQuery({
        queryKey: ["availableShifts"],
        queryFn: () => get_shifts_values(userName),
        placeholderData: (prev) => prev,
        enabled: !!userName
    });

    const totalMaxShiftsQuery = useQuery({
        queryKey: ["totalMax"],
        queryFn: () => get_total_max(userName),
        placeholderData: (prev) => prev,
        enabled: !!userName
    });

    const claimDates = datesQuery.data?.dates ?? []
    const availableShiftsValues = availableShiftsValuesQuery.data ?? {}
    const totalMaxShifts = totalMaxShiftsQuery.data ?? {}


    useEffect(() => {
        if (totalMaxShifts?.short !== 0) {
            setCombinedShifts(true)
        }
    }, [totalMaxShifts])


    const onSubmit = async (event) => {
        event.preventDefault()
        if (!claimValues.some(Boolean)) {
            showNotification('Изберете поне 1 претенция', true)
            return
        }
        try {
            console.log(userMessage)
            await save_user_claims_request(claimValues, userName, userMessage)

            setUserSavedClaims(claimValues)
        } catch (error) {
            showNotification('Claims haven`t been sent', true)
            console.log(error)
        }
    }

    console.log(totalMaxShifts)

    useEffect(() => {
        const handler = () => {
          setMobile(window.innerWidth < 1268);
        };
      
        window.addEventListener("resize", handler);
      
        return () => {
          window.removeEventListener("resize", handler);
        };
      }, []);

    return (
        <Context.Provider
        value={{
            userSavedClaims,
            claimDates,
            claimValues,
            setClaimValues,
            mobile,
            setMobile,
            errorOnReq,
            totalMaxShifts,
            availableShiftsValues,
            combinedShifts,
        }}>
            <div className = {pagestyles.app}>
                <Header />
                    <main className={pagestyles.requestContainer}>
                        {verificationPage ? 
                        (
                        <UserVerificationContainer
                        verifyUser = {verifyUser}/>
                        ) : 
                        (
                        <VerifiedUserContainer
                        userName = {userName}
                        userMessage = {userMessage}
                        setUserMessage = {setUserMessage}
                        onSubmit = {onSubmit}/>
                        )}
                    </main>
                <Footer />
            </div>
        </Context.Provider>
    );
}
 
export default Request;