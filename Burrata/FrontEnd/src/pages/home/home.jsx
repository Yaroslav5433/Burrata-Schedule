import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import HomePageContainer from "../../components/HomePageContainer/HomePageContainer";
import { useEffect, useState, useMemo } from "react";
import { Context } from "../../components/Context";
import { get_all_users_request_handler } from "../../utils/get_all_users_handler";
import { get_all_claims_request_handler } from "../../utils/get_all_claims_handler";
import { get_dates_request_handler } from "../../utils/get_dates_handler";
import { get_schedule_request_handler } from "../../utils/get_schedule_handler";
import { useParams } from "react-router-dom";

function Home() {

    const [allUsers, setAllUsers] = useState({})
    const [usersWithClaims, setUsersWithClaims] = useState({})
    const [weekDates, setWeekDates] = useState([])
    const [schedule, setSchedule] = useState([])
    const [showClaims, setShowClaims] = useState(true)

    const { department } = useParams()

    console.log("department:", department);

    useEffect(() => {
        const get_info = async () => {

            setAllUsers({})
            setUsersWithClaims({})
            setSchedule([])

            if (!department) return;

            const dates = await get_dates_request_handler()
            setWeekDates(dates["dates"])

            const all_users = await get_all_users_request_handler(department)
            if (!("detail" in all_users)) {
                setAllUsers(all_users)
            }

            const users_with_claims = await get_all_claims_request_handler(department)
            if (!("detail" in users_with_claims)) {
                setUsersWithClaims(users_with_claims)
            }

            const all_shifts = await get_schedule_request_handler(department)
            if (!("detail" in all_shifts)) {
                setSchedule(all_shifts)
            }
        }  

        get_info()
    }, [department])

    const allUsersShifts = useMemo(() => {
        const result = {};

        for (const [username, user] of Object.entries(allUsers ?? {})) {
            result[username] = user.shifts;
        }

        return result;
    }, [allUsers])


    const all_users_with_claims = useMemo(() => {
        return {
            ...allUsersShifts,
            ...usersWithClaims
        }
    }, [usersWithClaims, allUsersShifts])

    const all_users_shifts = useMemo(() => {
        return {
            ...allUsersShifts,
            ...schedule
        }
    }, [schedule, allUsersShifts])
    
    console.log('all usersssss', allUsers)

    return (
        <Context.Provider
        value = {{
            weekDates,
            setSchedule,
            all_users_with_claims,
            all_users_shifts,
            showClaims,
            setShowClaims,
            usersWithClaims,
            schedule,
            department,
            allUsers,
            setAllUsers
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