import { Context } from '@/components/Context.js';
import styles from './claimsTableForRequest.module.css'
import { useContext, useState } from 'react';
import TableWithDates from '@/components/TableWithDates/TableWithDates.jsx';

function ClaimsTableForRequest() {

    const {
      claimDates,
      userSavedClaims,
      claimValues,
      setClaimValues
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
      <TableWithDates
      dates = {claimDates}>
        <tr>
            {claimDates.map((date, i) => (
              <td className = 'schedule_select_td' key={date}>
                {!(userSavedClaims.some(Boolean)) ? (
                  <select 
                  value={claimValues[i]}
                  id={i}
                  onChange={(e) => handleChange(i, e.target.value)}
                  >
                    <option 
                    value=""></option>
                    <option  
                    value="X"
                    disabled={hasTwoX}>X</option>
                    <option  
                    value="1"
                    disabled={hasANumber}>1</option>
                    <option  
                    value="2"
                    disabled={hasANumber}>2</option>
                  </select>
                ) : (userSavedClaims?.[i] ?? '')}
              </td>
            ))}
          </tr>
      </TableWithDates>
    );
  }
export default ClaimsTableForRequest
