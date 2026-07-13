import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import DepartmentsNavBar from '@/components/AdminSchedule/DepartmentsNavBar/DepartmentsNavBar.jsx';
import ScheduleTableContainer from '@/components/AdminSchedule/ScheduleTableContainer/ScheduleTableContainer';
import MessagesPagination from "@/components/AdminSchedule/MessagesPagination/MessagesPagination";
import { useEffect, useState } from "react";
import { Context } from "@/components/Context";
import { get_all_users_request, get_default_shifts } from "@/api/requests";
import { get_all_claims_request } from "@/api/requests";
import { get_dates_request } from "@/api/requests";
import { get_schedule_request } from "@/api/requests";
import { get_vacations_for_table } from "@/api/requests";
import { get_messages } from "@/api/requests";
import { get_shifts_values } from "@/api/requests";
import { get_total_max } from "@/api/requests";
import { useParams } from "react-router-dom";
import styles from './home.module.css'
import pagestyles from '@/pages/pages.module.css'
import { useQuery } from "@tanstack/react-query";
import PopUpTableInput from "@/components/AdminSchedule/PopUpTableInput/PopUpTableInput";
import PopUpEditUser from "@/components/AdminSchedule/PopUpEditUser/PopUpEditUser";
import { DAYS_OF_THE_WEEK } from "@/utils/constants";

function Home() {

    const [showClaims, setShowClaims] = useState(true);
    const [showVacations, setShowVacations] = useState(false);
    const [dateStep, setDateStep] = useState(0);
    const [isEdit, setIsEdit] = useState(false);
    const [popUpIsOpen, setPopUpIsOpen] = useState(null);
    const [loading, setLoading] = useState(false);
    const [draftSchedule, setDraftSchedule] = useState(null);
    const [customEdit, setCustomEdit] = useState(false);
    const [addUser, setAddUser] = useState({'state': false, 'is_trainee': false})
    const [userTextName, setUserTextName] = useState('');

    const [days, setDays] = useState({});

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

    const messageQuery = useQuery({
        queryKey: ["messages", department],
        queryFn: () => get_messages(department, true),
        placeholderData: (prev) => prev,
        enabled: !!department,
        retry: 0
    });

    const vacationsQuery = useQuery({
        queryKey: ["vacations", dateStep],
        queryFn: () => get_vacations_for_table(dateStep),
        placeholderData: (prev) => prev,
        enabled: !!department,
        retry: 0
    });

    const availableShiftsValuesQuery = useQuery({
        queryKey: ["availableShifts", userTextName],
        queryFn: () => get_allowed_shifts_values(userId),
        placeholderData: (prev) => prev,
        enabled: popUpIsOpen === 'edituser'
    });

    const totalMaxShiftsQuery = useQuery({
        queryKey: ["totalMax", userTextName],
        queryFn: () => get_total_max(userId),
        placeholderData: (prev) => prev,
        enabled: popUpIsOpen === 'edituser'
    });

    const defaultShiftsQuery = useQuery({
        queryKey: ["defaultShifts"],
        queryFn: () => get_default_shifts(),
        placeholderData: (prev) => prev,
        enabled: (popUpIsOpen === 'fillup' || popUpIsOpen === 'editallusers'),
        retry: 0
    });

    const allUsers = usersQuery.data ?? {};
    const usersWithClaims = claimsQuery.data ?? {};
    const schedule = scheduleQuery.data ?? {};
    const weekDates = datesQuery.data?.dates ?? [];
    const messages = messageQuery.data ?? [];
    const usersWithVacations = vacationsQuery.data ?? {};
    const availableShiftsValues = availableShiftsValuesQuery.data ?? {};
    const totalMaxShifts = totalMaxShiftsQuery.data ?? {};
    const defaultShifts = defaultShiftsQuery.data ?? DAYS_OF_THE_WEEK;

    const workers = Object.fromEntries(
        Object.entries(allUsers).filter(([_, u]) => !u.is_trainee)
      );

    const trainees = Object.fromEntries(
        Object.entries(allUsers).filter(([_, u]) => u.is_trainee)
      );

    const schedule_to_show = isEdit 
    ? draftSchedule
    : schedule

    console.log('vacations', usersWithVacations)

    const workersWithClaims = {
    ...workers,
    ...Object.fromEntries(
        Object.entries(usersWithClaims).filter(([u]) => u in workers)
    ),
    };

    const workersWithVacations = {
        ...workers,
        ...Object.fromEntries(
            Object.entries(usersWithVacations).filter(([u]) => u in workers)
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

    const traineesWithVacations = {
        ...trainees,
        ...Object.fromEntries(
            Object.entries(usersWithVacations).filter(([u]) => u in trainees)
        ),
    };

    const traineesWithSchedule = {
    ...trainees,
    ...Object.fromEntries(
        Object.entries(schedule_to_show).filter(([u]) => u in trainees)
    ),
    };

    const all_workers_to_show = showVacations
    ? workersWithVacations
    : showClaims
        ? workersWithClaims
        : workersWithSchedule;

    const all_trainees_to_show = showVacations
        ? traineesWithVacations
        : showClaims
            ? traineesWithClaims
            : traineesWithSchedule;

    const handleDraftSet = () => {
        setDraftSchedule(structuredClone(scheduleQuery.data))
    }

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
            popUpIsOpen,
            setPopUpIsOpen,
            loading,
            setLoading,
            customEdit,
            setCustomEdit,
            userTextName,
            setUserTextName,
            addUser,
            setAddUser,
            workers,
            showVacations,
            setShowVacations,
            days,
            setDays,
            defaultShifts
        }}>
            {popUpIsOpen === 'fillup' && 
            <PopUpTableInput
            dates = {weekDates}
            fillUpTitle = 'Auto Fill Up'
            showLabel = {true}/>} 
            {popUpIsOpen === 'edituser' && 
            <PopUpEditUser
            availableShiftsValues = {availableShiftsValues}
            totalMaxShifts = {totalMaxShifts}
            />}
            {popUpIsOpen === 'editallusers' &&
            <PopUpTableInput
            fillUpTitle = 'Basic Settings'
            showLabel = {false}
            dates = {Object.keys(days)}/>}
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