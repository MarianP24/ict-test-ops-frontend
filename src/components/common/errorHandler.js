import {toast} from "react-toastify";

export const handleApiError = (error, operation) => {
    if (error.name === 'CanceledError' || error.name === 'AbortError' || error.code === 'ERR_CANCELED') {
        return; // Silently ignore cancellation errors
    }

    toast.error(`Failed to ${operation}`);
    console.error(`Error ${operation}:`, error);
};