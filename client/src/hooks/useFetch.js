import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { parseApiError } from "../lib/api";

export const useFetch = (url) => {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reloadKey, setReloadKey] = useState(0);

    const { token } = useSelector((state) => state.auth);

    const refetch = useCallback(() => {
        setReloadKey((key) => key + 1);
    }, []);
    
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });
                
                if (response.ok) {
                    const jsonData = await response.json();
                    setData(jsonData);
                } else {
                    throw await parseApiError(response, 'Error fetching data');
                }

            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [url, token, reloadKey])
    return { data, loading, error, refetch };
}
