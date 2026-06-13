import React from 'react'

function EmptyRowInTable() {
  return (
    <tr>
        <td></td>
        {Array(7).fill(undefined).map((_, j) => (
        <td key={j}></td>
        ))}
    </tr>
  )
}

export default EmptyRowInTable
