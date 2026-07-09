import { Context } from '@/components/Context.js';
import { useContext, useState } from 'react';
import TableWithDates from '@/components/TableWithDates/TableWithDates.jsx';
import ShiftsRow from './ShiftsRow/ShiftsRow';
import ClaimsTableMobile from './ClaimsTableMobile/ClaimsTableMobile';

function ClaimsTableForRequest() {

    const {
      claimDates,
      claimValues,
      setClaimValues,
      mobile,
    } = useContext(Context)

    const handleChange = (index, value) => {
      setClaimValues(prev => {
        const copy = [...prev];
        copy[index] = value;
        return copy;
      });
    };

    {console.log('claimValues', claimValues)}

    return (
      !mobile ? (
        <TableWithDates
        dates={claimDates}>
          <ShiftsRow
          handleChange = {handleChange}/>
        </TableWithDates>
      ) : (
        <ClaimsTableMobile
        handleChange = {handleChange}/>
    )
  );
}

export default ClaimsTableForRequest
