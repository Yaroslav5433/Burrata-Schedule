import { useEffect, useState } from "react";
import { useDefaultShifts } from "../useDefaultShifts";
import { useParams } from "react-router-dom";
import { useScheduleStore } from "../stores/useScheduleStore";
import { usePopupStore } from "../stores/usePopUpStore";
import { DAYS_OF_THE_WEEK } from "@/utils/constants";

export function usePopupTableInput() {

  const { department } = useParams()
  const defaultShiftsQuery = useDefaultShifts(department, !!department)
  const defaultShifts = defaultShiftsQuery.data ?? DAYS_OF_THE_WEEK

  const days = useScheduleStore(state => state.days)
  const setDays = useScheduleStore(state => state.setDays)
  const popup = usePopupStore(state => state.popup)

  const [onlyShort, setOnlyShort] = useState([])
  const [onlyLong, setOnlyLong] = useState([])  

  useEffect(() => {
    if ((popup === 'fillup' || popup === 'editallusers') && defaultShifts) {
        setDays(structuredClone(defaultShifts));
    }
  }, [popup, defaultShifts]);

  const handleTableInputChange = (e) => {
    let input = e.target.value

    input = input.replace(/[^0-9/]/g, "")

    setDays({
      ...days,
      [e.target.name]: input
    })
  }
  return {onlyLong, setOnlyLong, onlyShort, setOnlyShort, handleTableInputChange, days}
}