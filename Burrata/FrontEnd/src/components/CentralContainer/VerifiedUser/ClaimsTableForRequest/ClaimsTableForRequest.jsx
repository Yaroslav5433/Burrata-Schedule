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
      mobile
    } = useContext(Context)

    const [hasANumber, setHasANumber] = useState(false) 
    const [hasTwoX, setHasTwoX] = useState(false)

    const handleChange = (index, value) => {
      const copy = [...claimValues];
      copy[index] = value
      setClaimValues(copy);
      
      setHasANumber(["1", "2"].some(v => copy.includes(v)));
      setHasTwoX(copy.filter(v => v === "X").length > 1);
      {console.log(copy)}
    };


    return (
      !mobile ? (
        <TableWithDates
        dates={claimDates}>
          <ShiftsRow
          handleChange = {handleChange}
          hasANumber = {hasANumber}
          hasTwoX = {hasTwoX}/>
        </TableWithDates>
      ) : (
        <ClaimsTableMobile
        handleChange = {handleChange}
        hasANumber = {hasANumber}
        hasTwoX = {hasTwoX}/>
    )
  );
}

export default ClaimsTableForRequest
