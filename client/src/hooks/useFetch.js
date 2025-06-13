import {
    showtoast
} from "@/helpers/showtoast";
import {
    useEffect,
    useState
} from "react";

export const useFetch = (url, option = {}, dependances = []) => {
    const [data, setData] = useState();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await fetch(url, option);
                const resData = await res.json();
                if (!res.ok) {
                    throw new Error(`Error:${res.statusText},${res.status}`)
                }
                setData(resData);
                setError();
            } catch (error) {
                setError(error)
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, dependances);
    return {
        data,
        loading,
        error
    }
}