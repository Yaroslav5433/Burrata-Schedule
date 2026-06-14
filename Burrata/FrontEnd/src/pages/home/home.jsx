import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import DepartmentsNavBar from '@/components/AdminSchedule/DepartmentsNavBar/DepartmentsNavBar.jsx'
import ScheduleTableContainer from '@/components/AdminSchedule/ScheduleTableContainer/ScheduleTableContainer'
import { useState } from "react";
import { Context } from "@/components/Context";
import { get_all_users_request } from "@/api/requests";
import { get_all_claims_request } from "@/api/requests";
import { get_dates_request } from "@/api/requests";
import { get_schedule_request } from "@/api/requests";
import { useParams } from "react-router-dom";
import styles from './home.module.css'
import pagestyles from '@/pages/pages.module.css'
import { useQuery } from "@tanstack/react-query";

function Home() {

    const [showClaims, setShowClaims] = useState(true)
    const [dateStep, setDateStep] = useState(0)
    const [isEdit, setIsEdit] = useState(false)
    const [draftSchedule, setDraftSchedule] = useState(null)

    const { department } = useParams()

    const datesQuery = useQuery({
        queryKey: ["dates", dateStep],
        queryFn: () => get_dates_request(dateStep),
        placeholderData: (prev) => prev,
    });

    const usersQuery = useQuery({
        queryKey: ["users", department],
        queryFn: () => get_all_users_request(department),
        placeholderData: (prev) => prev,
        enabled: !!department,
        retry: 0
    });

    const claimsQuery = useQuery({
        queryKey: ["claims", department, dateStep],
        queryFn: () => get_all_claims_request(department, dateStep),
        placeholderData: (prev) => prev,
        enabled: !!department,
        retry: 0
    });

    const scheduleQuery = useQuery({
        queryKey: ["schedule", department, dateStep],
        queryFn: () => get_schedule_request(department, dateStep),
        placeholderData: (prev) => prev,
        enabled: !!department,
        retry: 0
    });

    const allUsers = usersQuery.data ?? {};
    const usersWithClaims = claimsQuery.data ?? {};
    const schedule = scheduleQuery.data ?? {};
    const weekDates = datesQuery.data?.dates ?? [];

    const workers = Object.fromEntries(
        Object.entries(allUsers).filter(([_, u]) => !u.is_trainee)
      );

    const trainees = Object.fromEntries(
        Object.entries(allUsers).filter(([_, u]) => u.is_trainee)
      );

    const schedule_to_show = isEdit 
    ? draftSchedule
    : schedule

    const workersWithClaims = {
    ...workers,
    ...Object.fromEntries(
        Object.entries(usersWithClaims).filter(([u]) => u in workers)
    ),
    };

    const workersWithSchedule = {
    ...workers,
    ...Object.fromEntries(
        Object.entries(schedule_to_show).filter(([u]) => u in workers)
    ),
    };

    const traineesWithClaims = {
    ...trainees,
    ...Object.fromEntries(
        Object.entries(usersWithClaims).filter(([u]) => u in trainees)
    ),
    };

    const traineesWithSchedule = {
    ...trainees,
    ...Object.fromEntries(
        Object.entries(schedule_to_show).filter(([u]) => u in trainees)
    ),
    };

    const all_workers_to_show = showClaims
    ? workersWithClaims
    : workersWithSchedule;

    const all_trainees_to_show = showClaims
    ? traineesWithClaims
    : traineesWithSchedule;

    console.log('draftSchedule', draftSchedule)
    
    const handleDraftSet = () => {
        setDraftSchedule(structuredClone(scheduleQuery.data))
    }

    return (
        <div className = {pagestyles.app}>
            <Header
            isAdmin = {true}/>
                    <div className={styles.schedule_page_container}>
                        <DepartmentsNavBar/>
                        <Context.Provider
                        value = {{
                            weekDates,
                            department,
                            all_workers_to_show,
                            all_trainees_to_show,
                            showClaims,
                            isEdit,
                            setIsEdit,
                            draftSchedule,
                            setDraftSchedule,
                            allUsers
                        }}>
                            <main className={styles.schedule_page_main_section_container}>
                                <ScheduleTableContainer
                                setShowClaims = {setShowClaims}
                                usersWithClaims = {usersWithClaims}
                                setDateStep = {setDateStep}
                                handleDraftSet = {handleDraftSet}
                                dateStep = {dateStep}
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