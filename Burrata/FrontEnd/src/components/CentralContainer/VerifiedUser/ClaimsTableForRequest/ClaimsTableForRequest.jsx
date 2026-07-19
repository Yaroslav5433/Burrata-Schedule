import TableWithDates from '@/components/TableWithDates/TableWithDates.jsx';
import ShiftsMobileRow from './ShiftsMobileRow/ShiftsMobileRow';
import { useMobile } from '@/hooks/useMobile';
import { useDates } from '@/hooks/useDates';
import ShiftsRow from './ShiftsRow/ShiftsRow';
import { useUserStore } from '@/hooks/requestPageHooks/stores/useUserStore';
import { useAvailableShifts } from '@/hooks/useAvailableShifts';
import Spinner from '@/components/Spinner/Spinner';

function ClaimsTableForRequest() {

    const isMobile = useMobile();
    const claimDatesQuery = useDates(0)
    const claimDates = claimDatesQuery.data?.dates ?? [];

    const userName = useUserStore(state => state.userName)

    const {
      data: availableShiftsValues = {},
      isLoading
    } = useAvailableShifts(userName);

    return (
      isMobile ? (
        isLoading ? (<Spinner/>) :
        <TableWithDates
        dates={claimDates}
        orientation = 'vertical'>
          {(date, dateId) => (
            <ShiftsMobileRow
            date = {date}
            dateId = {dateId}
            day={Object.keys(availableShiftsValues)[dateId]}/>
          )}
        </TableWithDates>
      ) : (
        <TableWithDates
        dates={claimDates}>
          <ShiftsRow/>
        </TableWithDates>
    )
  );
}

export default ClaimsTableForRequest
