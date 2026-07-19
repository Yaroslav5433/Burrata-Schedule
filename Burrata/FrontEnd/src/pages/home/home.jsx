import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import DepartmentsNavBar from '@/components/AdminSchedule/DepartmentsNavBar/DepartmentsNavBar.jsx';
import ScheduleTableContainer from '@/components/AdminSchedule/ScheduleTableContainer/ScheduleTableContainer';
import MessagesPagination from "@/components/AdminSchedule/MessagesPagination/MessagesPagination";
import styles from './home.module.css'
import pagestyles from '@/pages/pages.module.css'
import PopUpTableInput from "@/components/AdminSchedule/PopUpTableInput/PopUpTableInput";
import PopUpEditUser from "@/components/AdminSchedule/PopUpEditUser/PopUpEditUser";
import { useDates } from "@/hooks/useDates";
import { usePopupStore } from "@/hooks/homePageHooks/stores/usePopUpStore";
import { useScheduleStore } from "@/hooks/homePageHooks/stores/useScheduleStore";
import { useMobile } from "@/hooks/useMobile";

function Home() {
    
    const popup = usePopupStore(state => state.popup)
    const days = useScheduleStore(state => state.days)
    
    const dateStep = useScheduleStore(state => state.dateStep)
    const datesQuery = useDates(dateStep);
    const weekDates = datesQuery.data?.dates ?? [];

    const isMobile = useMobile();

    return (
        !isMobile ? (
            <>
            {popup === 'fillup' && 
            <PopUpTableInput
            dates = {weekDates}
            fillUpTitle = 'Auto Fill Up'
            showLabel = {true}/>} 
            {popup === 'edituser' && 
            <PopUpEditUser/>}
            {popup === 'editallusers' &&
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
                                <ScheduleTableContainer/>
                                <MessagesPagination/>
                            </main>
                    </div>
                <Footer/>
            </div>
        </> ) :
        <p>This site doesn`t have a mobile version</p>
    );
 }
 
export default Home;