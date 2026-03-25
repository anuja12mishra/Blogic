import { useEffect, useState } from "react";

interface FetchOptions extends RequestInit {
    credentials?: 'omit' | 'same-origin' | 'include';
}

interface FetchResult<T> {
    data: T | undefined;
    loading: boolean;
    error: any;
}

export const useFetch = <T>(url: string, option: FetchOptions = {}, dependances: any[] = []): FetchResult<T> => {
    const [data, setData] = useState<T | undefined>();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<any>();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await fetch(url, option);
                const resData = await res.json();
                if (!res.ok) {
                    throw new Error(`Error:${res.statusText},${res.status}`);
                }
                setData(resData);
                setError(undefined);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, dependances);

    return {
        data,
        loading,
        error
    };
};
