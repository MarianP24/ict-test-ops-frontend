import React, {useState, useEffect, useMemo} from 'react';
import MachineService from '../../services/MachineService';

const AddMachineForm = ({onMachineAdded, onMachineUpdated, editMachine}) => {
    const initialMachineState = useMemo(() => ({
        equipmentName: '',
        internalFactory: '',
        serialNumber: '',
        equipmentType: '',
        hostname: '',
        machineUsername: ''
    }), []);

    const [machine, setMachine] = useState(initialMachineState);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    useEffect(() => {
        if (editMachine) {
            setMachine(editMachine);
            setIsEditMode(true);
        } else {
            setMachine(initialMachineState);
            setIsEditMode(false);
        }
    }, [editMachine, initialMachineState]);

    const handleInputChange = event => {
        const {name, value} = event.target;
        setMachine({...machine, [name]: value});
    };

    const saveMachine = () => {
        // Validate form
        if (!machine.equipmentName || !machine.serialNumber || !machine.equipmentType) {
            setError("Please fill in all required fields");
            return;
        }

        setIsSubmitting(true);

        const data = {
            equipmentName: machine.equipmentName,
            internalFactory: parseInt(machine.internalFactory) || 0,
            serialNumber: machine.serialNumber,
            equipmentType: machine.equipmentType,
            hostname: machine.hostname,
            machineUsername: machine.machineUsername
        };

        if (isEditMode) {
            // Update existing machine
            MachineService.updateMachine(machine.id, data)
                .then(response => {
                    setSubmitted(true);
                    setError(null);
                    if (onMachineUpdated) {
                        onMachineUpdated(response.data);
                    }
                    setTimeout(() => setSubmitted(false), 3000);
                })
                .catch(err => {
                    console.error("Error updating machine:", err);
                    setError("Failed to update machine. Please try again.");
                })
                .finally(() => {
                    setIsSubmitting(false);
                });
        } else {
            // Create new machine
            MachineService.createMachine(data)
                .then(response => {
                    setMachine(initialMachineState);
                    setSubmitted(true);
                    setError(null);
                    if (onMachineAdded) {
                        onMachineAdded(response.data);
                    }
                    setTimeout(() => setSubmitted(false), 3000);
                })
                .finally(() => {
                    setIsSubmitting(false);
                });
        }
    };

    const resetForm = () => {
        setMachine(initialMachineState);
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
                                {isEditMode ? 'Machine updated successfully!' : 'Machine added successfully!'}
                            </h3>
                        </div>
                    </div>
                </div>
            ) : (
                <div>
                    <h3 className="text-xl font-semibold leading-6 text-gray-900 mb-6 pb-2 border-b border-gray-200">
                        {isEditMode ? 'Edit Machine' : 'Add New Machine'}
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
                            <label htmlFor="equipmentName" className="block text-sm font-medium text-gray-700 mb-1">
                                Equipment Name<span className="text-red-500">*</span>
                            </label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    id="equipmentName"
                                    name="equipmentName"
                                    required
                                    value={machine.equipmentName}
                                    onChange={handleInputChange}
                                    placeholder="Enter equipment name"
                                    className="shadow-sm bg-gray-50 focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-0 border-b-2 border-gray-200 focus:border-primary-500 rounded-lg px-3 py-2.5 transition-all duration-200"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="equipmentType" className="block text-sm font-medium text-gray-700 mb-1">
                                Equipment Type<span className="text-red-500">*</span>
                            </label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    id="equipmentType"
                                    name="equipmentType"
                                    required
                                    value={machine.equipmentType}
                                    onChange={handleInputChange}
                                    placeholder="Enter equipment type"
                                    className="shadow-sm bg-gray-50 focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-0 border-b-2 border-gray-200 focus:border-primary-500 rounded-lg px-3 py-2.5 transition-all duration-200"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="serialNumber" className="block text-sm font-medium text-gray-700 mb-1">
                                Serial Number<span className="text-red-500">*</span>
                            </label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    id="serialNumber"
                                    name="serialNumber"
                                    required
                                    value={machine.serialNumber}
                                    onChange={handleInputChange}
                                    placeholder="Enter serial number"
                                    className="shadow-sm bg-gray-50 focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-0 border-b-2 border-gray-200 focus:border-primary-500 rounded-lg px-3 py-2.5 transition-all duration-200"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="internalFactory" className="block text-sm font-medium text-gray-700 mb-1">
                                Internal Factory
                            </label>
                            <div className="mt-1">
                                <input
                                    type="number"
                                    id="internalFactory"
                                    name="internalFactory"
                                    value={machine.internalFactory}
                                    onChange={handleInputChange}
                                    placeholder="Enter internal factory number"
                                    className="shadow-sm bg-gray-50 focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-0 border-b-2 border-gray-200 focus:border-primary-500 rounded-lg px-3 py-2.5 transition-all duration-200"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="hostname" className="block text-sm font-medium text-gray-700 mb-1">
                                Hostname
                            </label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    id="hostname"
                                    name="hostname"
                                    value={machine.hostname}
                                    onChange={handleInputChange}
                                    placeholder="Enter hostname"
                                    className="shadow-sm bg-gray-50 focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-0 border-b-2 border-gray-200 focus:border-primary-500 rounded-lg px-3 py-2.5 transition-all duration-200"
                                />
                            </div>
                        </div>
                        <div className="sm:col-span-3">
                            <label htmlFor="machineUsername" className="block text-sm font-medium text-gray-700 mb-1">
                                Username
                            </label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    id="machineUsername"
                                    name="machineUsername"
                                    value={machine.machineUsername}
                                    onChange={handleInputChange}
                                    placeholder="Enter Username"
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
                                onClick={saveMachine}
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
                                ) : isEditMode ? 'Update Machine' : 'Add Machine'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddMachineForm;