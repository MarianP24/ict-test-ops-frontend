import React, {useState, useEffect, useCallback} from 'react';
import PropTypes from 'prop-types';
import MachineService from '../../services/MachineService';
import VpnServerService from "../../services/VpnServerService";

const AssignVpnServerToMachineModal = ({machine, isOpen, onClose, onAssign}) => {
    const [vpnServers, setVpnServers] = useState([]);
    const [assignedVpnServer, setAssignedVpnServer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedVpnServerId, setSelectedVpnServerId] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [submissionError, setSubmissionError] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [actionType, setActionType] = useState('assign'); // 'assign' or 'remove'

    const fetchAssignedVpnServer = useCallback(() => {
        if (!machine?.id) return;

        console.log('=== DEBUG fetchAssignedVpnServer ===');
        console.log('Fetching machine details for ID:', machine.id);

        MachineService.getMachineById(machine.id)
            .then(response => {
                console.log('Machine API response:', response.data);

                const machineData = response.data;

                // Check if we have a vpnServerId
                if (machineData.vpnServerId) {
                    console.log('Found vpnServerId:', machineData.vpnServerId, 'Type:', typeof machineData.vpnServerId);

                    // Find the VPN server in the already loaded list
                    setVpnServers(currentServers => {
                        const assignedServer = currentServers.find(server => server.id === machineData.vpnServerId);

                        if (assignedServer) {
                            console.log('Found assigned VPN server in list:', assignedServer);
                            setAssignedVpnServer(assignedServer);
                        } else {
                            console.log('VPN server not found in list, creating minimal object');
                            // Create minimal object if not found in list
                            setAssignedVpnServer({
                                id: machineData.vpnServerId,
                                vpnName: `VPN Server ${machineData.vpnServerId}`
                            });
                        }

                        return currentServers; // Don't change the servers list
                    });
                } else {
                    console.log('No VPN server assigned');
                    setAssignedVpnServer(null);
                }
            })
            .catch(error => {
                console.error('Error fetching assigned VPN server:', error);
                setAssignedVpnServer(null);
            });
    }, [machine?.id]);

    useEffect(() => {
        if (isOpen) {
            setSubmitted(false);
            setSubmissionError(false);
            setError(null);
            setActionType('assign');
            setSelectedVpnServerId('');

            // First fetch VPN servers, then fetch assigned server
            fetchVpnServers().then(() => {
                fetchAssignedVpnServer();
            });
        }
    }, [isOpen, fetchAssignedVpnServer]);

    const fetchVpnServers = () => {
        setLoading(true);
        setError(null);
        const controller = new AbortController();
        const signal = controller.signal;

        return VpnServerService.getAllVpnServers(signal)
            .then(response => {
                if (signal.aborted) return;

                console.log('VPN servers response:', response);
                setVpnServers(response.data || []);
                setLoading(false);
                return response.data || [];
            })
            .catch(error => {
                if (signal.aborted) return;
                console.error('Error fetching VPN servers:', error);
                setError('Failed to load VPN servers. Please try again.');
                setLoading(false);
                throw error;
            });
    };

    const getAvailableVpnServers = () => {
        console.log('=== DEBUG getAvailableVpnServers ===');
        console.log('actionType:', actionType);
        console.log('assignedVpnServer:', assignedVpnServer);
        console.log('all vpnServers:', vpnServers);

        if (actionType === 'assign') {
            // For assign: show VPN servers NOT currently assigned to this machine
            if (assignedVpnServer) {
                console.log('Filtering out assigned VPN server with ID:', assignedVpnServer.id);
                console.log('Type of assignedVpnServer.id:', typeof assignedVpnServer.id);

                const availableServers = vpnServers.filter(server => {
                    console.log(`Comparing server ${server.id} (${typeof server.id}) with assigned ${assignedVpnServer.id} (${typeof assignedVpnServer.id})`);
                    return String(server.id) !== String(assignedVpnServer.id);
                });

                console.log('Available servers after filtering:', availableServers);
                return availableServers;
            } else {
                console.log('No VPN server assigned, showing all servers');
                return vpnServers;
            }
        } else {
            // For remove: show only the currently assigned VPN server
            const removeServers = assignedVpnServer ? [assignedVpnServer] : [];
            console.log('Servers for remove action:', removeServers);
            return removeServers;
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!selectedVpnServerId && actionType === 'assign') {
            setError("Please select a VPN server");
            return;
        }

        if (!machine || !machine.id || machine.id === 'undefined') {
            setError("Invalid machine selected. Please try again.");
            return;
        }

        setIsSubmitting(true);
        setSubmitted(false);
        setSubmissionError(false);

        if (actionType === 'remove') {
            MachineService.removeVpnServer(machine.id)
                .then(response => {
                    setSubmitted(true);
                    fetchAssignedVpnServer(); // Refresh assigned VPN server
                    setSelectedVpnServerId('');
                    setTimeout(() => {
                        if (onAssign) onAssign();
                    }, 2000);
                })
                .catch(err => {
                    console.error("Error removing VPN server from machine:", err);
                    setSubmissionError(true);
                    setTimeout(() => setSubmissionError(false), 3000);
                })
                .finally(() => {
                    setIsSubmitting(false);
                });
        } else {
            console.log(`Assigning VPN server ${selectedVpnServerId} to machine ${machine.id}`);

            MachineService.assignVpnServer(machine.id, selectedVpnServerId)
                .then(response => {
                    setSubmitted(true);
                    fetchAssignedVpnServer(); // Refresh assigned VPN server
                    setSelectedVpnServerId('');
                    setTimeout(() => {
                        if (onAssign) onAssign();
                    }, 2000);
                })
                .catch(err => {
                    console.error("Error assigning VPN server to machine:", err);
                    setSubmissionError(true);
                    setTimeout(() => setSubmissionError(false), 3000);
                })
                .finally(() => {
                    setIsSubmitting(false);
                });
        }
    };

    const getSuccessMessage = () => {
        return actionType === 'assign'
            ? 'VPN server assigned successfully'
            : 'VPN server removed successfully';
    };

    const getErrorMessage = () => {
        return actionType === 'assign'
            ? 'Failed to assign VPN server to machine. Please try again.'
            : 'Failed to remove VPN server from machine. Please try again.';
    };

    if (!isOpen) return null;

    const availableVpnServers = getAvailableVpnServers();

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="absolute top-0 right-0 pt-4 pr-4 z-10">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                            <span className="sr-only">Close</span>
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>

                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="max-w-full">
                            {submissionError ? (
                                <div className="rounded-md bg-red-50 p-4 mb-4">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd"
                                                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                                      clipRule="evenodd"/>
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-red-800">
                                                {getErrorMessage()}
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            ) : submitted ? (
                                <div className="rounded-md bg-green-50 p-4 mb-4">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd"
                                                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                      clipRule="evenodd"/>
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-green-800">
                                                {getSuccessMessage()}
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            ) : null}

                            <h2 className="text-xl font-semibold leading-6 text-gray-900 mb-6 pb-2 border-b border-gray-200">
                                Manage VPN Server Assignment
                            </h2>

                            <div className="mb-4">
                                <h3 className="font-semibold">Selected Machine:</h3>
                                <p>Equipment Name: {machine?.equipmentName}</p>
                                {machine?.internalFactory && <p>Internal Factory: {machine.internalFactory}</p>}
                                {machine?.equipmentType && <p>Equipment Type: {machine.equipmentType}</p>}
                            </div>

                            {/* Currently Assigned VPN Server */}
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

                            {/* Action Type Selection */}
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

                            {loading ? (
                                <p>Loading VPN servers...</p>
                            ) : error ? (
                                <div className="rounded-md bg-red-50 p-4">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd"
                                                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                                      clipRule="evenodd"/>
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
                                                        : 'No VPN server is currently assigned to this machine.'}
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="relative">
                                                <select
                                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-8"
                                                    value={selectedVpnServerId}
                                                    onChange={(e) => setSelectedVpnServerId(e.target.value)}
                                                    required={actionType === 'assign'}
                                                >
                                                    <option value="">
                                                        {actionType === 'assign' ? 'Choose a VPN server' : 'Choose VPN server to remove'}
                                                    </option>
                                                    {availableVpnServers.map((server) => (
                                                        <option key={server.id} value={server.id}>
                                                            {server.vpnName}
                                                        </option>
                                                    ))}
                                                </select>
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                                                    </svg>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {availableVpnServers.length > 0 && (
                                        <div className="flex items-center justify-between">
                                            <button
                                                type="button"
                                                onClick={onClose}
                                                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                                disabled={isSubmitting}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className={`font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                                                    actionType === 'remove'
                                                        ? 'bg-red-500 hover:bg-red-700 text-white'
                                                        : 'bg-primary-500 hover:bg-primary-700 text-white'
                                                }`}
                                                disabled={isSubmitting || (actionType === 'assign' && !selectedVpnServerId)}
                                            >
                                                {isSubmitting
                                                    ? (actionType === 'remove' ? 'Removing...' : 'Assigning...')
                                                    : (actionType === 'remove' ? 'Remove VPN Server' : 'Assign VPN Server')
                                                }
                                            </button>
                                        </div>
                                    )}
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
    machine: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        equipmentName: PropTypes.string.isRequired,
        internalFactory: PropTypes.string,
        equipmentType: PropTypes.string
    }).isRequired,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onAssign: PropTypes.func
};

export default AssignVpnServerToMachineModal;