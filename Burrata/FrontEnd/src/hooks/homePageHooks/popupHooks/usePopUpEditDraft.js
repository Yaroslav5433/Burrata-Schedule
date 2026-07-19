import { useState, useEffect } from "react";
import { useUserStore } from "../stores/useUserStore";
import { useAvailableShifts } from "@/hooks/useAvailableShifts";
import { useTotalMaxShifts } from "@/hooks/useTotalMaxShifts";
import { useParams } from "react-router-dom";

export function usePopupEditDraft() {

    const { department } = useParams()
    const userTextName = useUserStore(state => state.userTextName)

    const availableShiftsValuesQuery = useAvailableShifts(userTextName, !!department)
    const totalMaxShiftsQuery = useTotalMaxShifts(userTextName, !!department)

    const availableShiftsValues = availableShiftsValuesQuery.data ?? {}
    const totalMaxShifts = totalMaxShiftsQuery.data ?? {}

    const [totalMaxShiftDraft, setTotalMaxShiftDraft] = useState({});
    const [availableShiftsValuesDraft, setAvailableShiftsValuesDraft] = useState({});

    useEffect(() => {
        if (availableShiftsValues) {
          setAvailableShiftsValuesDraft(structuredClone(availableShiftsValues));
        }
      }, [availableShiftsValues]);
      
      useEffect(() => {
        if (totalMaxShifts) {
          setTotalMaxShiftDraft(structuredClone(totalMaxShifts));
        }
      }, [totalMaxShifts]);
    
      const days = Object.keys(availableShiftsValuesDraft ?? {});
      const shifts = Object.keys(availableShiftsValuesDraft?.[days[0]] ?? {});
    
      const handleCheckChange = (day, shift, checked) => {
        setAvailableShiftsValuesDraft(prev => {
          const copy = structuredClone(prev);
          copy[day][shift] = checked;
          return copy;
        });
      };
    
      const handleCount = (shift, operator) => {
        setTotalMaxShiftDraft(prev => {
          const current = prev[shift];
      
          const next =
            operator === 'plus'
              ? current + 1
              : current - 1;
      
          return {
            ...prev,
            [shift]: Math.min(7, Math.max(0, next))
          };
        });
      };

      return {handleCheckChange, handleCount, totalMaxShiftDraft, availableShiftsValuesDraft, days, shifts}
}