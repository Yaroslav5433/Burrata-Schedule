import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import HomePageContainer from "../../components/HomePageContainer/HomePageContainer";
import { useEffect, useState } from "react";
import { Context } from "../../components/Context";
import { get_all_users } from "../../utils/get_all_users";

function Home() {

    const [allUsers, setAllUsers] = useState([])
    const [thisWeekDates, setthisWeekDates] = useState([])

    useEffect(() => {
        const get_users = async () => {
            const users_and_dates = await get_all_users()
            setAllUsers(users_and_dates.all_users)
            setthisWeekDates(users_and_dates.this_week_dates)
        }  

        get_users()
    }, [])

    return (
        <Context.Provider
        value = {{
            allUsers,
            thisWeekDates
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