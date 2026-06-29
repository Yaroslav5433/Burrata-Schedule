import { useParams } from "react-router-dom";


const service = ["X", "1", "2", "Д", "Д12"];
const bar = ["X", "1", "2", "Д8", "Д12", "Д14"];
const hostess = ["X", "1", "2", "Д13"];
const kitchen = ["X", "1", "2", "Д", "Д11", "Д22"];


export const useOptions = () => {
    const { department } = useParams();
    console.log('type: ', department)

    const options = {
        service,
        bar,
        hostess,
        kitchen,
    };

    return options[department] || [];
}