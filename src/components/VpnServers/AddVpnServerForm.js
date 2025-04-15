import React, {useState, useEffect, useMemo} from 'react';
import VpnServerService from '../../services/VpnServerService';

const AddVpnServerForm = ({onVpnServerAdded, onVpnServerUpdated, editVpnServer}) => {
    const initialVpnServerState = useMemo(() => ({
        vpnName: '',
        serverAddress: '',
        destinationNetwork: ''
    }), []);

    const [vpnServer, setVpnServer] = useState(initialVpnServerState);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    useEffect(() => {
        if (editVpnServer) {
            setVpnServer(editVpnServer);
            setIsEditMode(true);
        } else {
            setVpnServer(initialVpnServerState);
            setIsEditMode(false);
        }
    }, [editVpnServer, initialVpnServerState]);

    const handleInputChange = event => {
        const {name, value} = event.target;
        setVpnServer({...vpnServer, [name]: value});
    };

    const saveVpnServer = () => {
        // Validate form
        if (!vpnServer.vpnName || !vpnServer.serverAddress || !vpnServer.destinationNetwork) {
            setError("Please fill in all required fields");
            return;
        }

        setIsSubmitting(true);

        const data = {
            vpnName: vpnServer.vpnName,
            serverAddress: vpnServer.serverAddress,
            destinationNetwork: vpnServer.destinationNetwork
        };

        if (isEditMode) {
            // Update existing VPN server
            VpnServerService.updateVpnServer(vpnServer.id, data)
                .then(response => {
                    setSubmitted(true);
                    setError(null);
                    if (onVpnServerUpdated) {
                        onVpnServerUpdated(response.data);
                    }
                    setTimeout(() => setSubmitted(false), 3000);
                })
                .catch(err => {
                    console.error("Error updating VPN server:", err);
                    setError("Failed to update VPN server. Please try again.");
                })
                .finally(() => {
                    setIsSubmitting(false);
                });
        } else {
            // Create new VPN server
            VpnServerService.createVpnServer(data)
                .then(response => {
                    setVpnServer(initialVpnServerState);
                    setSubmitted(true);
                    setError(null);
                    if (onVpnServerAdded) {
                        onVpnServerAdded(response.data);
                    }
                    setTimeout(() => setSubmitted(false), 3000);
                })
                .finally(() => {
                    setIsSubmitting(false);
                });
        }
    };

    const resetForm = () => {
        setVpnServer(initialVpnServerState);
        setSubmitted(false);
        setError(null);
    };

    return (
        <div className="max-w-full">
            {submitted ? (
                <div className="rounded-md bg-green-50 p-4">
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
                                {isEditMode ? 'VPN server updated successfully!' : 'VPN server added successfully!'}
                            </h3>
                        </div>
                    </div>
                </div>
            ) : (
                <div>
                    <h3 className="text-xl font-semibold leading-6 text-gray-900 mb-6 pb-2 border-b border-gray-200">
                        {isEditMode ? 'Edit VPN Server' : 'Add New VPN Server'}
                    </h3>

                    {error && (
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
                                    <h3 className="text-sm font-medium text-red-800">{error}</h3>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                            <label htmlFor="vpnName" className="block text-sm font-medium text-gray-700 mb-1">
                                VPN Name<span className="text-red-500">*</span>
                            </label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    id="vpnName"
                                    name="vpnName"
                                    required
                                    value={vpnServer.vpnName}
                                    onChange={handleInputChange}
                                    placeholder="Enter VPN name"
                                    className="shadow-sm bg-gray-50 focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-0 border-b-2 border-gray-200 focus:border-primary-500 rounded-lg px-3 py-2.5 transition-all duration-200"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="serverAddress" className="block text-sm font-medium text-gray-700 mb-1">
                                Server Address<span className="text-red-500">*</span>
                            </label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    id="serverAddress"
                                    name="serverAddress"
                                    required
                                    value={vpnServer.serverAddress}
                                    onChange={handleInputChange}
                                    placeholder="Enter server address"
                                    className="shadow-sm bg-gray-50 focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-0 border-b-2 border-gray-200 focus:border-primary-500 rounded-lg px-3 py-2.5 transition-all duration-200"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-6">
                            <label htmlFor="destinationNetwork"
                                   className="block text-sm font-medium text-gray-700 mb-1">
                                Destination Network<span className="text-red-500">*</span>
                            </label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    id="destinationNetwork"
                                    name="destinationNetwork"
                                    required
                                    value={vpnServer.destinationNetwork}
                                    onChange={handleInputChange}
                                    placeholder="Enter destination network"
                                    className="shadow-sm bg-gray-50 focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-0 border-b-2 border-gray-200 focus:border-primary-500 rounded-lg px-3 py-2.5 transition-all duration-200"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-5">
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={resetForm}
                                className="bg-white py-2.5 px-5 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
                            >
                                Reset
                            </button>
                            <button
                                type="button"
                                onClick={saveVpnServer}
                                disabled={isSubmitting}
                                className={`ml-3 inline-flex justify-center py-2.5 px-5 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white 
                                ${isSubmitting ? 'bg-primary-400' : 'bg-primary-600 hover:bg-primary-700'} 
                                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                             xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                                    strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor"
                                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Saving...
                                    </>
                                ) : isEditMode ? 'Update VPN Server' : 'Add VPN Server'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddVpnServerForm;