import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import DepartmentsNavBar from '@/components/AdminSchedule/DepartmentsNavBar/DepartmentsNavBar.jsx'
import ScheduleTableContainer from '@/components/AdminSchedule/ScheduleTableContainer/ScheduleTableContainer'
import MessagesPagination from "@/components/AdminSchedule/MessagesPagination/MessagesPagination";
import { useState } from "react";
import { Context } from "@/components/Context";
import { get_all_users_request } from "@/api/requests";
import { get_all_claims_request } from "@/api/requests";
import { get_dates_request } from "@/api/requests";
import { get_schedule_request } from "@/api/requests";
import { fill_up_schedule_request } from "@/api/requests"
import { get_messages } from "@/api/requests";
import { useParams } from "react-router-dom";
import styles from './home.module.css'
import pagestyles from '@/pages/pages.module.css'
import { useQuery } from "@tanstack/react-query";
import PopUp from "@/components/PopUp/PopUp";
import { useNotification } from "@/components/ModalWindow/ModalWindow";
import { demandsInputValidation, getAllFreeWorkers } from "@/utils/utils";


function Home() {

    const [showClaims, setShowClaims] = useState(true);
    const [dateStep, setDateStep] = useState(0);
    const [isEdit, setIsEdit] = useState(false);
    const [popUpIsOpen, setPopUpIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [draftSchedule, setDraftSchedule] = useState(null);
    const [customEdit, setCustomEdit] = useState(false);

    const { department } = useParams()

    const { showNotification } = useNotification()
    
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

    const messageQuery = useQuery({
        queryKey: ["messages", department],
        queryFn: () => get_messages(department, true),
        placeholderData: (prev) => prev,
        enabled: !!department,
        retry: 0
    });

    const allUsers = usersQuery.data ?? {};
    const usersWithClaims = claimsQuery.data ?? {};
    const schedule = scheduleQuery.data ?? {};
    const weekDates = datesQuery.data?.dates ?? [];
    const messages = messageQuery.data ?? [];

    console.log('messages', messageQuery.data)

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
    
    const handleDraftSet = () => {
        setDraftSchedule(structuredClone(scheduleQuery.data))
    }

    const handleFillUpSubmit = async (e, demands) => {
        e.preventDefault();
        const onlyWorkersDraftSchedule = Object.fromEntries(
            Object.keys(workers).map(name => [
                name,
                draftSchedule[name] ?? workers[name]
            ])
        )
        
        const inputIsValid = demandsInputValidation(
            demands,
            getAllFreeWorkers(onlyWorkersDraftSchedule))

        if (inputIsValid['isValid'] === false) {
            showNotification(inputIsValid['message'], true)
            return
        }

        setPopUpIsOpen(false)
        setLoading(true)

        try {
            const res = await fill_up_schedule_request(onlyWorkersDraftSchedule, demands)
            setDraftSchedule(res['schedule'])
        } catch (error) {
            showNotification(error.message, true)
        } finally {
            setLoading(false)
        }
    }

    console.log(messages)

    return (
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
            allUsers,
            setPopUpIsOpen,
            loading,
            setLoading,
            customEdit,
            setCustomEdit
        }}>
            {popUpIsOpen && 
            <PopUp
            dates = {weekDates}
            handleFillUpSubmit = {handleFillUpSubmit}/>}
            <div className = {pagestyles.app}>
                <Header
                isAdmin = {true}/>
                    <div className={styles.schedule_page_container}>
                        <DepartmentsNavBar/>
                            <main className={styles.schedule_page_main_section_container}>
                                <ScheduleTableContainer
                                setShowClaims = {setShowClaims}
                                usersWithClaims = {usersWithClaims}
                                setDateStep = {setDateStep}
                                handleDraftSet = {handleDraftSet}
                                dateStep = {dateStep}
                                />
                                <MessagesPagination
                                messages = {messages}/>
                            </main>
                    </div>
                <Footer/>
            </div>
        </Context.Provider>
    );
 }
 
export default Home;