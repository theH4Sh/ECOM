import { useEffect, useState } from "react";

export const useFetch = (url) => {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                
                if (response.ok) {
                    const jsonData = await response.json();
                    setData(jsonData);
                    setLoading(false);
                } else {
                    throw new Error('Error fetching data');
                }

            } catch (error) {
                setError(error);
            }
        }

        fetchData();
    }, [url])
    return { data, loading, error };
}