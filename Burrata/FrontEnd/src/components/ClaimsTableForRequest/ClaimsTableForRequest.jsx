import { Context } from '../Context.js';
import styles from './claimsTableForRequest.module.css'
import { useContext, useState } from 'react';

function ClaimsTableForRequest() {

    const {
      userHasClaims,
      claimDates,
      userSavedClaims,
      claimValues,
      setClaimValues
    } = useContext(Context)

    const [hasANumber, setHasANumber] = useState(false) 
    const [hasTwoX, setHasTwoX] = useState(false)

    const handleChange = (index, value) => {
      const copy = [...claimValues];
      copy[index] = value === "" ? undefined : value;
      setClaimValues(copy);
      if (["1", "2"].some(v => copy.includes(v))) {
        setHasANumber(true)
      } else {
        setHasANumber(false)
      }
      if (copy.filter(v => v === "X").length > 1) {
        setHasTwoX(true)
      } else {
        setHasTwoX(false)
      }
      {console.log(copy)}
    };


    return (
      <table className={styles.table}>
        <tbody>
          <tr>
            {claimDates.map((date, i) => (
              <td key={i}>{date}</td>
            ))}
          </tr>
  
          <tr>
            {claimDates.map((date, i) => (
              <td key={date}>
                {!userHasClaims ? (
                  <select
                    value={claimValues[i]}
                    onChange={(e) => handleChange(i, e.target.value)}
                  >
                    <option value={undefined}>{undefined}</option>
                    <option value="X"
                    disabled={hasTwoX}>X</option>
                    <option value="1"
                    disabled={hasANumber}
                    >1</option>
                    <option value="2"
                    disabled={hasANumber}
                    >2</option>
                  </select>
                ) : (userSavedClaims?.[date] ?? '')}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    );
  }
export default ClaimsTableForRequest
