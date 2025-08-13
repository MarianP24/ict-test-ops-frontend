import { useState, useCallback, useRef } from 'react';
import { toast } from 'react-toastify';

const useLongRunningOperation = (timeoutMs = 25000) => {
    const [isLoading, setIsLoading] = useState(false);
    const abortControllerRef = useRef(null);
    const loadingToastRef = useRef(null);

    const cleanup = useCallback(() => {
        // Cleanup abort controller
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }

        // Cleanup loading toast
        if (loadingToastRef.current) {
            toast.dismiss(loadingToastRef.current);
            loadingToastRef.current = null;
        }

        setIsLoading(false);
    }, []);

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

        // Prevent multiple concurrent operations
        if (isLoading) {
            console.warn('Operation already in progress');
            return;
        }

        // Cleanup any previous operation
        cleanup();

        setIsLoading(true);

        // Create new abort controller
        abortControllerRef.current = new AbortController();
        const signal = abortControllerRef.current.signal;

        // Show loading toast
        loadingToastRef.current = toast.info(loadingMessage, {
            autoClose: false,
            closeButton: false
        });

        try {
            // Create a timeout promise
            const timeoutPromise = new Promise((_, reject) => {
                const timeoutId = setTimeout(() => {
                    console.warn(`Operation timed out after ${timeoutMs}ms`);
                    if (abortControllerRef.current) {
                        abortControllerRef.current.abort();
                    }
                    reject(new Error('TIMEOUT'));
                }, timeoutMs);

                // Cleanup timeout if operation completes
                signal.addEventListener('abort', () => {
                    clearTimeout(timeoutId);
                });
            });

            // Race between the operation and timeout
            const axiosTimeout = Math.min(timeoutMs + 5000, 60000); // Cap at 60s
            console.log(`Starting operation - Frontend timeout: ${timeoutMs}ms, Axios timeout: ${axiosTimeout}ms`);

            const result = await Promise.race([
                operation(signal, axiosTimeout),
                timeoutPromise
            ]);

            // Success cleanup
            if (loadingToastRef.current) {
                toast.dismiss(loadingToastRef.current);
                loadingToastRef.current = null;
            }

            toast.success(successMessage);

            if (onSuccess) onSuccess(result);
            return result;

        } catch (error) {
            // Error cleanup
            if (loadingToastRef.current) {
                toast.dismiss(loadingToastRef.current);
                loadingToastRef.current = null;
            }

            // Skip error handling if operation was aborted (component unmounted)
            if (signal.aborted && error.name === 'AbortError') {
                return;
            }

            // Enhanced error checking
            const isTimeoutError = error.message === 'TIMEOUT' ||
                error.code === 'ECONNABORTED' ||
                error.name === 'AbortError' ||
                error.message?.includes('timeout') ||
                error.message?.includes('Network Error');

            if (isTimeoutError) {
                toast.warning(timeoutMessage);
            } else {
                console.error('Long running operation error:', {
                    message: error.message,
                    code: error.code,
                    name: error.name,
                    response: error.response?.data,
                    status: error.response?.status
                });

                const finalErrorMessage = typeof errorMessage === 'function'
                    ? errorMessage(error)
                    : errorMessage;
                toast.error(finalErrorMessage);
            }

            if (onError) onError(error);
            throw error;

        } finally {
            setIsLoading(false);
            abortControllerRef.current = null;

            if (onFinally) onFinally();
        }
    }, [timeoutMs, isLoading, cleanup]);

    // Cleanup effect for component unmounting
    const cancel = useCallback(() => {
        cleanup();
    }, [cleanup]);

    return {
        execute,
        isLoading,
        cancel // Allow manual cancellation
    };
};

export default useLongRunningOperation;