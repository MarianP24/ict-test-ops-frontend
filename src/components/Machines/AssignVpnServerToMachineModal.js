import React, { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import MachineService from '../../services/MachineService';
import VpnServerService from "../../services/VpnServerService";

const AssignVpnServerToMachineModal = ({ machine, isOpen, onClose, onAssign }) => {
    // State management
    const [vpnServers, setVpnServers] = useState([]);
    const [assignedVpnServer, setAssignedVpnServer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedVpnServerId, setSelectedVpnServerId] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [submissionError, setSubmissionError] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [actionType, setActionType] = useState('assign');

    // Reset state when modal opens/closes
    const resetModalState = useCallback(() => {
        setSubmitted(false);
        setSubmissionError(false);
        setError(null);
        setActionType('assign');
        setSelectedVpnServerId('');
        setAssignedVpnServer(null);
        setVpnServers([]);
        setLoading(true);
    }, []);

    // Combined initialization function - BEST PRACTICE: Single effect for modal initialization
    const initializeModal = useCallback(async () => {
        if (!machine?.id) return;

        try {
            setLoading(true);
            setError(null);

            // Step 1: Fetch VPN servers
            const vpnResponse = await VpnServerService.getAllVpnServers();
            console.log('VPN servers response:', vpnResponse);
            const servers = vpnResponse.data || [];
            setVpnServers(servers);

            // Step 2: Fetch machine details
            console.log('Fetching machine details for ID:', machine.id);
            const machineResponse = await MachineService.getMachineById(machine.id);
            console.log('Machine API response:', machineResponse.data);

            const machineData = machineResponse.data;

            // Step 3: Set assigned VPN server
            if (machineData.vpnServerId) {
                const assignedServer = servers.find(server => server.id === machineData.vpnServerId);

                if (assignedServer) {
                    console.log('Found assigned VPN server:', assignedServer);
                    setAssignedVpnServer(assignedServer);
                } else {
                    console.log('VPN server not found in list, creating minimal object');
                    setAssignedVpnServer({
                        id: machineData.vpnServerId,
                        vpnName: `VPN Server ${machineData.vpnServerId}`
                    });
                }
            } else {
                console.log('No VPN server assigned');
                setAssignedVpnServer(null);
            }

        } catch (error) {
            console.error('Error initializing modal:', error);
            setError('Failed to load VPN servers. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [machine?.id]);

    // Single useEffect for modal initialization - BEST PRACTICE
    useEffect(() => {
        if (isOpen) {
            resetModalState();
            initializeModal();
        }
    }, [isOpen, resetModalState, initializeModal]);

    // Memoized available servers calculation with reduced logging - BEST PRACTICE
    const availableVpnServers = useMemo(() => {
        // Only log when we have meaningful data
        if (vpnServers.length > 0) {
            console.log('Calculating available VPN servers - Action:', actionType, 'Total servers:', vpnServers.length, 'Assigned:', assignedVpnServer?.vpnName || 'None');
        }

        if (actionType === 'assign') {
            if (assignedVpnServer) {
                const filtered = vpnServers.filter(server =>
                    String(server.id) !== String(assignedVpnServer.id)
                );
                return filtered;
            }
            return vpnServers;
        } else {
            return assignedVpnServer ? [assignedVpnServer] : [];
        }
    }, [actionType, assignedVpnServer, vpnServers]);

    // Handle form submission
    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();

        if (!selectedVpnServerId && actionType === 'assign') {
            setError("Please select a VPN server");
            return;
        }

        if (!machine?.id) {
            setError("Invalid machine selected. Please try again.");
            return;
        }

        setIsSubmitting(true);
        setSubmitted(false);
        setSubmissionError(false);
        setError(null);

        try {
            if (actionType === 'remove') {
                await MachineService.removeVpnServer(machine.id);
                console.log('VPN server removed successfully');
            } else {
                console.log(`Assigning VPN server ${selectedVpnServerId} to machine ${machine.id}`);
                await MachineService.assignVpnServer(machine.id, selectedVpnServerId);
                console.log('VPN server assigned successfully');
            }

            setSubmitted(true);
            setSelectedVpnServerId('');

            // Refresh the data after successful operation
            await initializeModal();

            // Auto-close after success
            setTimeout(() => {
                if (onAssign) onAssign();
            }, 2000);

        } catch (error) {
            console.error(`Error ${actionType === 'assign' ? 'assigning' : 'removing'} VPN server:`, error);
            setSubmissionError(true);

            // Auto-hide error after 3 seconds
            setTimeout(() => setSubmissionError(false), 3000);
        } finally {
            setIsSubmitting(false);
        }
    }, [selectedVpnServerId, actionType, machine?.id, onAssign, initializeModal]);

    // Memoized messages - BEST PRACTICE
    const messages = useMemo(() => ({
        success: actionType === 'assign'
            ? 'VPN server assigned successfully'
            : 'VPN server removed successfully',
        error: actionType === 'assign'
            ? 'Failed to assign VPN server to machine. Please try again.'
            : 'Failed to remove VPN server from machine. Please try again.'
    }), [actionType]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    {/* Close button */}
                    <div className="absolute top-0 right-0 pt-4 pr-4 z-10">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            aria-label="Close modal"
                        >
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>

                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="max-w-full">
                            {/* Status messages */}
                            {submissionError && (
                                <div className="rounded-md bg-red-50 p-4 mb-4">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-red-800">
                                                {messages.error}
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {submitted && (
                                <div className="rounded-md bg-green-50 p-4 mb-4">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-green-800">
                                                {messages.success}
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <h2 className="text-xl font-semibold leading-6 text-gray-900 mb-6 pb-2 border-b border-gray-200">
                                Manage VPN Server Assignment
                            </h2>

                            {/* Machine info */}
                            <div className="mb-4">
                                <h3 className="font-semibold">Selected Machine:</h3>
                                <p>Equipment Name: {machine?.equipmentName}</p>
                                {machine?.internalFactory && <p>Internal Factory: {machine.internalFactory}</p>}
                                {machine?.equipmentType && <p>Equipment Type: {machine.equipmentType}</p>}
                            </div>

                            {/* Currently assigned VPN server */}
                            <div className="mb-4 p-3 bg-gray-50 rounded-md">
                                <h4 className="font-semibold text-sm text-gray-700 mb-2">Currently Assigned VPN Server:</h4>
                                {assignedVpnServer ? (
                                    <div className="text-sm text-gray-600">
                                        <p>• {assignedVpnServer.vpnName}</p>
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500">No VPN server currently assigned</p>
                                )}
                            </div>

                            {/* Action type selection */}
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Choose Action:
                                </label>
                                <div className="flex space-x-4">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            value="assign"
                                            checked={actionType === 'assign'}
                                            onChange={(e) => {
                                                setActionType(e.target.value);
                                                setSelectedVpnServerId('');
                                                setError(null);
                                            }}
                                            className="mr-2"
                                        />
                                        Assign VPN Server
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            value="remove"
                                            checked={actionType === 'remove'}
                                            onChange={(e) => {
                                                setActionType(e.target.value);
                                                setSelectedVpnServerId('');
                                                setError(null);
                                            }}
                                            className="mr-2"
                                        />
                                        Remove VPN Server
                                    </label>
                                </div>
                            </div>

                            {/* Loading/Error/Form content */}
                            {loading ? (
                                <div className="flex items-center justify-center p-4">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                                    <span className="ml-2">Loading VPN servers...</span>
                                </div>
                            ) : error ? (
                                <div className="rounded-md bg-red-50 p-4">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-red-800">{error}</h3>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-4 relative">
                                        <label className="block text-gray-700 text-sm font-bold mb-2">
                                            {actionType === 'assign' ? 'Select VPN Server to Assign:' : 'Select VPN Server to Remove:'}
                                        </label>

                                        {availableVpnServers.length === 0 ? (
                                            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                                                <p className="text-sm text-yellow-800">
                                                    {actionType === 'assign'
                                                        ? 'No VPN servers available to assign.'
                                                        : 'No VPN server to remove.'}
                                                </p>
                                            </div>
                                        ) : (
                                            <select
                                                value={selectedVpnServerId}
                                                onChange={(e) => setSelectedVpnServerId(e.target.value)}
                                                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                required={actionType === 'assign'}
                                            >
                                                <option value="">
                                                    {actionType === 'assign' ? '-- Select VPN Server --' : '-- Select VPN Server to Remove --'}
                                                </option>
                                                {availableVpnServers.map(server => (
                                                    <option key={server.id} value={server.id}>
                                                        {server.vpnName}
                                                    </option>
                                                ))}
                                            </select>
                                        )}
                                    </div>

                                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                        <button
                                            type="submit"
                                            disabled={isSubmitting || (actionType === 'assign' && availableVpnServers.length === 0)}
                                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isSubmitting ? 'Processing...' : (actionType === 'assign' ? 'Assign VPN Server' : 'Remove VPN Server')}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

AssignVpnServerToMachineModal.propTypes = {
    machine: PropTypes.object,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onAssign: PropTypes.func
};

export default AssignVpnServerToMachineModal;