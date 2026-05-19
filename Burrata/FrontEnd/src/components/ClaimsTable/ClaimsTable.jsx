import styles from './claimsTable.module.css'
import { useState } from 'react';

function ClaimsTable() {
    let dates = ["01.01", "02.01", "03.01", "04.01", "05.01", "06.01", "07.01"]  
    const [values, setValues] = useState(Array(7).fill(""));
  
    const handleChange = (index, value) => {
      const copy = [...values];
      copy[index] = value;
      setValues(copy);
    };
  
    return (
      <table className={styles.table}>
        <tbody className={styles.tableBody}>
          <tr className={styles.dates}>
            {dates.map((date, i) => (
              <td key={i}>{date}</td>
            ))}
          </tr>
  
          <tr className={styles.claims}>
            {dates.map((_, i) => (
              <td key={i}>
                <select
                  value={values[i]}
                  onChange={(e) => handleChange(i, e.target.value)}
                >
                  <option value="X">X</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                </select>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    );
  }
export default ClaimsTable
