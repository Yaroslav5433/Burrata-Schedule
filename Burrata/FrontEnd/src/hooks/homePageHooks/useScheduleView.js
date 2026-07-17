import { useRef } from "react";
import { useScheduleStore } from "./stores/useScheduleStore";
import { useClaims } from "./useClaims";
import { useSchedule } from "./useSchedule";
import { useUsers } from "./useUsers";
import { useVacations } from "./useVacations";
import { useMemo } from "react";

export function useScheduleView() {
    
    const dateStep = useScheduleStore(state => state.dateStep)
    const {department} = useRef()

    const draftSchedule = useScheduleStore(state => state.draftSchedule)
    const showClaims = useScheduleStore(state => state.showClaims)
    const showVacations = useScheduleStore(state => state.showVacations)
    const isEdit = useScheduleStore(state => state.isEdit)

    const usersQuery = useUsers(department, !!department)
    const claimsQuery = useClaims(department, dateStep, !!department)
    const vacationsQuery = useVacations(dateStep, !!department)
    const scheduleQuery = useSchedule(department, dateStep, !!department)

    const usersWithClaims = claimsQuery.data ?? {};
    const allUsers = usersQuery.data ?? {}
    const usersWithVacations = vacationsQuery.data ?? {};
    const schedule = scheduleQuery.data ?? {};
        
    const scheduleToShow = isEdit
        ? draftSchedule
        : schedule;

    const workers = useMemo(
        () =>
            Object.fromEntries(
                Object.entries(allUsers).filter(
                    ([_, user]) => !user.is_trainee
                )
            ),
        [allUsers]
    );

    const trainees = useMemo(
        () =>
            Object.fromEntries(
                Object.entries(allUsers).filter(
                    ([_, user]) => user.is_trainee
                )
            ),
        [allUsers]
    );

    function mergeUsers(users, data) {
        return {
            ...users,
            ...Object.fromEntries(
                Object.entries(data).filter(([name]) => name in users)
            ),
        };
    }

    
    const workersWithClaims = useMemo(
        () => mergeUsers(workers, usersWithClaims),
        [workers, usersWithClaims]
    );
    
    const workersWithVacations = useMemo(
        () => mergeUsers(workers, usersWithVacations),
        [workers, usersWithVacations]
    );
    
    const workersWithSchedule = useMemo(
        () => mergeUsers(workers, scheduleToShow),
        [workers, scheduleToShow]
    );
    
    
    const traineesWithClaims = useMemo(
        () => mergeUsers(trainees, usersWithClaims),
        [trainees, usersWithClaims]
    );
    
    const traineesWithVacations = useMemo(
        () => mergeUsers(trainees, usersWithVacations),
        [trainees, usersWithVacations]
    );
    
    const traineesWithSchedule = useMemo(
        () => mergeUsers(trainees, scheduleToShow),
        [trainees, scheduleToShow]
    );


    const all_workers_to_show = useMemo(
        () =>
            showVacations
                ? workersWithVacations
                : showClaims
                    ? workersWithClaims
                    : workersWithSchedule,
        [
            showVacations,
            showClaims,
            workersWithVacations,
            workersWithClaims,
            workersWithSchedule,
        ]
    );
    
    const all_trainees_to_show = useMemo(
        () =>
            showVacations
                ? traineesWithVacations
                : showClaims
                    ? traineesWithClaims
                    : traineesWithSchedule,
        [
            showVacations,
            showClaims,
            traineesWithVacations,
            traineesWithClaims,
            traineesWithSchedule,
        ]
    );

    return {
        workers,
        trainees,
        all_workers_to_show,
        all_trainees_to_show,
    };
}