import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import ApplicationService from '../../services/ApplicationService';

const ApplicationPage = () => {
    const [logs, setLogs] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isConfirmShutdownOpen, setIsConfirmShutdownOpen] = useState(false);
    const [isConfirmRestartOpen, setIsConfirmRestartOpen] = useState(false);
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
            if (!error.name || error.name !== 'AbortError') {
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

    const handleShutdown = async () => {
        try {
            setIsLoading(true);
            await ApplicationService.shutdownApplication();
            toast.success('Application shutdown initiated successfully');
            setIsConfirmShutdownOpen(false);
        } catch (error) {
            toast.error('Failed to shutdown application');
            console.error('Error shutting down application:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRestart = async () => {
        try {
            setIsLoading(true);
            await ApplicationService.restartApplication();
            toast.success('Application restart initiated successfully');
            setIsConfirmRestartOpen(false);

            // Wait for restart and fetch new logs
            setTimeout(() => {
                fetchLogs();
            }, 5000);
        } catch (error) {
            toast.error('Failed to restart application');
            console.error('Error restarting application:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
        if (!isOpen) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-md">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
                    <p className="text-sm text-gray-500 mb-4">{message}</p>
                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Processing...' : 'Confirm'}
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-xl p-6">
                <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Application Controls</h1>

                <div className="flex flex-col md:flex-row md:justify-between mb-6">
                    <div className="mb-4 md:mb-0">
                        <p className="text-gray-600 mb-4">Manage application lifecycle operations</p>
                        <div className="flex space-x-4">
                            <button
                                onClick={() => setIsConfirmRestartOpen(true)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-70"
                                disabled={isLoading}
                            >
                                Restart Application
                            </button>
                            <button
                                onClick={() => setIsConfirmShutdownOpen(true)}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-70"
                                disabled={isLoading}
                            >
                                Shutdown Application
                            </button>
                        </div>
                    </div>

                    <div>
                        <button
                            onClick={fetchLogs}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors flex items-center"
                            disabled={isLoading}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                />
                            </svg>
                            Refresh Logs
                        </button>
                    </div>
                </div>

                <div className="mt-8">
                    <h2 className="text-lg font-semibold text-gray-700 mb-2">Application Logs</h2>
                    <div
                        ref={logsRef}
                        className="bg-gray-900 text-gray-200 p-4 rounded-md font-mono text-sm h-96 overflow-y-auto"
                    >
                        {isLoading ? (
                            <div className="flex justify-center items-center h-full">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                            </div>
                        ) : logs ? (
                            <pre className="whitespace-pre-wrap">{logs}</pre>
                        ) : (
                            <p className="text-gray-500">No logs available</p>
                        )}
                    </div>
                </div>
            </div>

            <ConfirmationModal
                isOpen={isConfirmShutdownOpen}
                onClose={() => setIsConfirmShutdownOpen(false)}
                onConfirm={handleShutdown}
                title="Confirm Shutdown"
                message="Are you sure you want to shutdown the application? This will terminate all running processes."
            />

            <ConfirmationModal
                isOpen={isConfirmRestartOpen}
                onClose={() => setIsConfirmRestartOpen(false)}
                onConfirm={handleRestart}
                title="Confirm Restart"
                message="Are you sure you want to restart the application? This may cause temporary service interruption."
            />
        </div>
    );
};

export default ApplicationPage;