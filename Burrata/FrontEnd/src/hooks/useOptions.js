import { useParams } from "react-router-dom";


const service = ["X", "1", "2", "Д", "Д12", "V"];
const bar = ["X", "1", "2", "Д8", "Д12", "Д14", "V"];
const hostess = ["X", "1", "2", "Д13", "V"];
const kitchen = ["X", "1", "2", "Д", "Д11", "Д22", "V"];


export const useOptions = () => {
    const { department } = useParams();

    const options = {
        service,
        bar,
        hostess,
        kitchen,
    };

    return options[department] || [];
}