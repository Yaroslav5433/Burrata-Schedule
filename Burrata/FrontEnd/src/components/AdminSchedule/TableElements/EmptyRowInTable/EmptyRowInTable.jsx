import React from 'react'
import { EMPTY_ARRAY_OF_SEVEN } from '@/utils/constants'

function EmptyRowInTable() {
  return (
    <tr>
        <td></td>
        {EMPTY_ARRAY_OF_SEVEN.map((_, j) => (
        <td key={j}></td>
        ))}
    </tr>
  )
}

export default EmptyRowInTable
