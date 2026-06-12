import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import DepartmentsNavBar from '../../components/DepartmentsNavBar/DepartmentsNavBar.jsx'
import ScheduleTableContainer from '../../components/ScheduleTableContainer/ScheduleTableContainer'
import { useEffect, useState, useMemo } from "react";
import { Context } from "../../components/Context";
import { get_all_users_request_handler } from "../../utils/get_all_users_handler";
import { get_all_claims_request_handler } from "../../utils/get_all_claims_handler";
import { get_dates_request_handler } from "../../utils/get_dates_handler";
import { get_schedule_request_handler } from "../../utils/get_schedule_handler";
import { useParams } from "react-router-dom";
import styles from './home.module.css'

function Home() {

    const [allUsers, setAllUsers] = useState({})
    const [usersWithClaims, setUsersWithClaims] = useState({})
    const [weekDates, setWeekDates] = useState([])
    const [schedule, setSchedule] = useState([])
    const [showClaims, setShowClaims] = useState(true)
    const [dateStep, setDateStep] = useState(0)

    const { department } = useParams()

    useEffect(() => {
        const get_info = async () => {

            setAllUsers({})
            setUsersWithClaims({})
            setSchedule([])

            if (!department) return;

            const dates = await get_dates_request_handler(dateStep)
            setWeekDates(dates["dates"])

            const all_users = await get_all_users_request_handler(department)
            if (!("detail" in all_users)) {
                setAllUsers(all_users)
            }

            const users_with_claims = await get_all_claims_request_handler(department, dateStep)
            if (!("detail" in users_with_claims)) {
                setUsersWithClaims(users_with_claims)
            }

            const all_shifts = await get_schedule_request_handler(department, dateStep)
            if (!("detail" in all_shifts)) {
                setSchedule(all_shifts)
            }
        }  

        get_info()
    }, [department, dateStep])


    const allUsersShifts = useMemo(() => {
        const result = {};

        for (const [username, user] of Object.entries(allUsers ?? {})) {
            if (!user.is_trainee) {
                result[username] = user.shifts;
            }
        }

        return result;
    }, [allUsers])

    const allTraineesShifts = useMemo(() => {
        const result = {};

        for (const [username, user] of Object.entries(allUsers ?? {})) {
            if (user.is_trainee) {
                result[username] = user.shifts;
            }
        }

        return result;
    }, [allUsers])


    const all_users_with_claims = useMemo(() => {
        return {
            ...allUsersShifts,
            ...Object.fromEntries(
                Object.entries(usersWithClaims)
                .filter(([username]) => username in allUsersShifts)
            )
        }
    }, [usersWithClaims, allUsersShifts])

    const all_users_shifts = useMemo(() => {
        return {
            ...allUsersShifts,
            ...Object.fromEntries(
                Object.entries(schedule)
                .filter(([username]) => username in allUsersShifts)
            )
        }
    }, [schedule, allUsersShifts])


    const all_trainees_with_claims = useMemo(() => {
        return {
            ...allTraineesShifts,
            ...Object.fromEntries(
                Object.entries(usersWithClaims)
                .filter(([username]) => username in allTraineesShifts)
            )
        }
    }, [usersWithClaims, allUsersShifts])

    const all_trainess_shifts = useMemo(() => {
        return {
            ...allTraineesShifts,
            ...Object.fromEntries(
                Object.entries(schedule)
                .filter(([username]) => username in allTraineesShifts)
            )
        }
    }, [schedule, allUsersShifts])

    const all_workers_to_show = showClaims ? all_users_with_claims : all_users_shifts
    const all_trainees_to_show = showClaims ? all_trainees_with_claims : all_trainess_shifts

    return (
        <div className = "app">
            <Header
            isAdmin = {true}/>
                    <div className={styles.schedule_page_container}>
                        <DepartmentsNavBar/>
                        <Context.Provider
                        value = {{
                            weekDates,
                            setSchedule,
                            department,
                            allUsers,
                            setAllUsers,
                            all_workers_to_show,
                            all_trainees_to_show,
                            showClaims
                        }}>
                            <main className={styles.schedule_page_main_section_container}>
                                <ScheduleTableContainer
                                setShowClaims = {setShowClaims}
                                usersWithClaims = {usersWithClaims}
                                schedule = {schedule}
                                dateStep = {dateStep}
                                setDateStep = {setDateStep}
                                />
                                <h1>Messages</h1>
                            </main>
                        </Context.Provider>
                    </div>
            <Footer/>
        </div>
    );
 }
 
export default Home;