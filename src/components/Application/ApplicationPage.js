
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import ApplicationService from '../../services/ApplicationService';
import ConfirmationModal from '../common/ConfirmationModal';
import { useApplicationLogs } from '../common/hooks/useApplicationLogs';
import { RESTART_DELAY, MODAL_CONFIG } from '../common/constants/applicationServiceConstants';
import { handleApiError } from '../common/errorHandler';

const ApplicationPage = () => {
    const { logs, isLoading: logsLoading, logsRef, fetchLogs } = useApplicationLogs();
    const [isConfirmShutdownOpen, setIsConfirmShutdownOpen] = useState(false);
    const [isConfirmRestartOpen, setIsConfirmRestartOpen] = useState(false);
    const [loadingStates, setLoadingStates] = useState({
        shutdown: false,
        restart: false
    });

    const setLoading = (operation, isLoading) => {
        setLoadingStates(prev => ({ ...prev, [operation]: isLoading }));
    };

    const handleShutdown = async () => {
        try {
            setLoading('shutdown', true);
            await ApplicationService.shutdownApplication();
            toast.success('Application shutdown initiated successfully');
            setIsConfirmShutdownOpen(false);
        } catch (error) {
            handleApiError(error, 'shutdown application');
        } finally {
            setLoading('shutdown', false);
        }
    };

    const handleRestart = async () => {
        try {
            setLoading('restart', true);
            await ApplicationService.restartApplication();
            toast.success('Application restart initiated successfully');
            setIsConfirmRestartOpen(false);

            // Wait for restart and fetch new logs
            setTimeout(fetchLogs, RESTART_DELAY);
        } catch (error) {
            handleApiError(error, 'restart application');
        } finally {
            setLoading('restart', false);
        }
    };

    const isAnyLoading = logsLoading || loadingStates.shutdown || loadingStates.restart;

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
                                disabled={isAnyLoading}
                            >
                                {loadingStates.restart ? 'Restarting...' : 'Restart Application'}
                            </button>
                            <button
                                onClick={() => setIsConfirmShutdownOpen(true)}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-70"
                                disabled={isAnyLoading}
                            >
                                {loadingStates.shutdown ? 'Shutting down...' : 'Shutdown Application'}
                            </button>
                        </div>
                    </div>

                    <div>
                        <button
                            onClick={fetchLogs}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors flex items-center"
                            disabled={logsLoading}
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
                            {logsLoading ? 'Loading...' : 'Refresh Logs'}
                        </button>
                    </div>
                </div>

                <div className="mt-8">
                    <h2 className="text-lg font-semibold text-gray-700 mb-2">Application Logs</h2>
                    <div
                        ref={logsRef}
                        className="bg-gray-900 text-gray-200 p-4 rounded-md font-mono text-sm h-96 overflow-y-auto"
                    >
                        {logsLoading ? (
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
                title={MODAL_CONFIG.shutdown.title}
                message={MODAL_CONFIG.shutdown.message}
                isLoading={loadingStates.shutdown}
            />

            <ConfirmationModal
                isOpen={isConfirmRestartOpen}
                onClose={() => setIsConfirmRestartOpen(false)}
                onConfirm={handleRestart}
                title={MODAL_CONFIG.restart.title}
                message={MODAL_CONFIG.restart.message}
                isLoading={loadingStates.restart}
            />
        </div>
    );
};

export default ApplicationPage;