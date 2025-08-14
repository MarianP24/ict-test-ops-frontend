import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import ApplicationService from '../../../services/ApplicationService';

export const useApplicationLogs = () => {
    const [logs, setLogs] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const abortControllerRef = useRef(null);
    const logsRef = useRef(null);

    const fetchLogs = async () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();
        setIsLoading(true);

        try {
            const response = await ApplicationService.getApplicationLogs(abortControllerRef.current.signal);
            setLogs(response.data);

            // Scroll to the bottom of logs
            if (logsRef.current) {
                logsRef.current.scrollTop = logsRef.current.scrollHeight;
            }
        } catch (error) {
            if (error.name !== 'CanceledError' && error.name !== 'AbortError' && error.code !== 'ERR_CANCELED') {
                toast.error('Failed to fetch application logs');
                console.error('Error fetching logs:', error);
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();

        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    return { logs, isLoading, logsRef, fetchLogs };
};