import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';

const useLongRunningOperation = (timeoutMs = 25000) => {
    const [isLoading, setIsLoading] = useState(false);

    const execute = useCallback(async (operation, options = {}) => {
        const {
            loadingMessage = 'Processing... This may take a few seconds.',
            successMessage = 'Operation completed successfully!',
            timeoutMessage = 'Operation timed out. It may still be processing in the background.',
            errorMessage = 'Operation failed. Please try again.',
            onSuccess,
            onError,
            onFinally
        } = options;

        setIsLoading(true);

        // Show loading toast
        const loadingToast = toast.info(loadingMessage, {
            autoClose: false,
            closeButton: false
        });

        try {
            // Create abort controller
            const controller = new AbortController();
            const signal = controller.signal;

            // Create a timeout promise with enhanced error info
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => {
                    console.warn(`Operation timed out after ${timeoutMs}ms`);
                    controller.abort();
                    reject(new Error('TIMEOUT'));
                }, timeoutMs);
            });

            // Race between the operation and timeout
            const axiosTimeout = timeoutMs + 5000;
            console.log(`Starting long-running operation - Frontend timeout: ${timeoutMs}ms, Axios timeout: ${axiosTimeout}ms`);
            
            const result = await Promise.race([
                operation(signal, axiosTimeout), // Give axios slightly more time
                timeoutPromise
            ]);

            toast.dismiss(loadingToast);
            toast.success(successMessage);

            if (onSuccess) onSuccess(result);
            return result;

        } catch (error) {
            toast.dismiss(loadingToast);

            // Enhanced error checking for timeout scenarios
            const isTimeoutError = error.message === 'TIMEOUT' ||
                error.code === 'ECONNABORTED' ||
                error.name === 'AbortError' ||
                error.message?.includes('timeout') ||
                error.message?.includes('Network Error');

            if (isTimeoutError) {
                toast.warning(timeoutMessage);
            } else {
                // Log the actual error for debugging
                console.error('Long running operation error:', {
                    message: error.message,
                    code: error.code,
                    name: error.name,
                    response: error.response?.data,
                    status: error.response?.status
                });

                toast.error(typeof errorMessage === 'function' ? errorMessage(error) : errorMessage);
            }

            if (onError) onError(error);
            throw error;

        } finally {
            setIsLoading(false);
            if (onFinally) onFinally();
        }
    }, [timeoutMs]);

    return { execute, isLoading };
};

export default useLongRunningOperation;