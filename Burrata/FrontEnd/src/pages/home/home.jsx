import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import HomePageContainer from "../../components/HomePageContainer/HomePageContainer";
import { useEffect, useState } from "react";
import { Context } from "../../components/Context";
import { get_all_users } from "../../utils/get_all_users";
import { get_all_claims } from "../../utils/get_all_claims";

function Home() {

    const [allUsers, setAllUsers] = useState([])
    const [thisWeekDates, setthisWeekDates] = useState([])
    const [shiftValues, setShiftValues] = useState([])

    useEffect(() => {
        const get_claims = async () => {
            if (allUsers.length > 0) {
                const table = Array(allUsers.length)
                .fill(null)
                .map(() =>
                    Array(thisWeekDates.length).fill(undefined)
            )

            const all_claims_response = await get_all_claims()

            all_claims_response.forEach(claim => {
                const userIndex = allUsers.findIndex(u => u === claim.username);
                const dateIndex = thisWeekDates.findIndex(d => d === claim.date);
            
                if (userIndex !== -1 && dateIndex !== -1) {
                    table[userIndex][dateIndex] = claim.shift;
                }
            });

            console.log(all_claims_response);
            console.log(thisWeekDates)

            setShiftValues(table) 
     }}
     get_claims()}, [allUsers, thisWeekDates]);
    

    useEffect(() => {
        const get_users = async () => {
            const users_and_dates = await get_all_users()
            setAllUsers(users_and_dates.all_users)
            setthisWeekDates(users_and_dates.this_week_dates)
        }  

        get_users()
    }, [])

    return (
        <Context.Provider
        value = {{
            allUsers,
            thisWeekDates,
            shiftValues,
            setShiftValues
        }}>
            <div className = "app">
            <Header/>
                    <HomePageContainer/>
            <Footer/>
        </div>
        </Context.Provider>
    );
 }
 
export default Home;