import styles from './ScheduleTable.module.css'
import EmptyRowInTable from '@/components/AdminSchedule/TableElements/EmptyRowInTable/EmptyRowInTable.jsx'
import ValuesInTable from '@/components/AdminSchedule/TableElements/ValuesInTable/ValuesInTable.jsx'
import AddUserInTable from '@/components/AdminSchedule/TableElements/AddUserInTable/AddUserInTable.jsx'
import CountValuesInTable from '@/components/AdminSchedule/TableElements/CountValuesInTable/CountValuesInTable.jsx'
import { useDates } from '@/hooks/useDates'
import { useScheduleStore } from '@/hooks/homePageHooks/stores/useScheduleStore'
import { useHandleEditDraftSchedule } from '@/hooks/homePageHooks/useHandleEditDraftSchedule'
import { useHandleSVGClick } from '@/hooks/homePageHooks/useHandleSVGClick'
import { useHandleSaveUser } from '@/hooks/homePageHooks/useHandleSaveUser'
import { useScheduleView } from '@/hooks/homePageHooks/useScheduleView'

function ScheduleTable() {

    const dateStep = useScheduleStore(state => state.dateStep)

    const weekDatesQuery = useDates(dateStep)
    const weekDates = weekDatesQuery.data?.dates ?? []
    const {all_trainees_to_show, all_workers_to_show} = useScheduleView()

    const handleEditChange = useHandleEditDraftSchedule()
    const saveUser = useHandleSaveUser()
    const handleSVGClick = useHandleSVGClick()
    
  return (
    <table className={styles.table}>
        <tbody>
            <tr>
                <td></td>
                {weekDates.map((date, i) => (
                    <td key={i}>{date}</td>
                ))} 
            </tr>

            <ValuesInTable
            all_users_to_show = {all_workers_to_show}
            handleSVGClick = {handleSVGClick}
            handleEditChange = {handleEditChange}/>

            <AddUserInTable
            saveUser = {saveUser}
            handleSVGClick = {handleSVGClick}
            icon_name = 'plus'
            is_trainee = {false}/>

            <EmptyRowInTable/>

            <CountValuesInTable/>

            <EmptyRowInTable/>

            <ValuesInTable
            all_users_to_show = {all_trainees_to_show}
            handleSVGClick = {handleSVGClick}
            handleEditChange = {handleEditChange}/>

            <AddUserInTable
            saveUser = {saveUser}
            handleSVGClick = {handleSVGClick}
            icon_name = 'plus_trainee'
            is_trainee = {true}/>

        </tbody>
      </table>
  )
}

export default ScheduleTable
