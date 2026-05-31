import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import HomePageContainer from "../../components/HomePageContainer/HomePageContainer";
import { useEffect, useState, useMemo } from "react";
import { Context } from "../../components/Context";
import { get_all_users_request_handler } from "../../utils/get_all_users_handler";
import { get_all_claims_request_handler } from "../../utils/get_all_claims_handler";
import { get_dates_request_handler } from "../../utils/get_dates_handler";

function Home() {

    const [allUsers, setAllUsers] = useState({})
    const [usersWithClaims, setUsersWithClaims] = useState({})
    const [weekDates, setWeekDates] = useState([])
    const [showClaims, setShowClaims] = useState(true)


    useEffect(() => {
        const get_info = async () => {

            const dates = await get_dates_request_handler()
            setWeekDates(dates["dates"])

            const all_users = await get_all_users_request_handler()
            setAllUsers(all_users)

            const users_with_claims = await get_all_claims_request_handler()
            setUsersWithClaims(users_with_claims)

        }  

        get_info()
    }, [])

    console.log(showClaims)

    const all_users_with_claims = useMemo(() => {
        return {
            ...allUsers,
            ...usersWithClaims
        }
    }, [allUsers, usersWithClaims])
    

    return (
        <Context.Provider
        value = {{
            weekDates,
            setAllUsers,
            all_users_with_claims,
            showClaims,
            setShowClaims
        }}>
            <div className = "app">
            <Header/>
                    <HomePageContainer/>
            <Footer/>
        </div>
        </Context.Provider>
    );
 }
 
export default Home;