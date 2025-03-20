import React, {useState, useEffect} from 'react';
import MachineService from '../services/MachineService';

const AssignFixtureToMachineModal = ({fixture, isOpen, onClose, onAssign}) => {
    const [machines, setMachines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedMachineId, setSelectedMachineId] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [submissionError, setSubmissionError] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchMachines();
            setSubmitted(false);
            setSubmissionError(false);
            setError(null);
        }
    }, [isOpen]);

    const fetchMachines = () => {
        setLoading(true);
        MachineService.getAllMachines()
            .then(response => {
                setMachines(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching machines:', error);
                setError('Failed to load machines. Please try again.');
                setLoading(false);
            });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!selectedMachineId) {
            setError("Please select a machine");
            return;
        }

        setIsSubmitting(true);
        setSubmitted(false);
        setSubmissionError(false);

        onAssign(fixture.id, selectedMachineId)
            .then(response => {
                setSubmitted(true);
                setTimeout(() => setSubmitted(false), 3000);
            })
            .catch(err => {
                console.error("Error assigning fixture to machine:", err);
                setSubmissionError(true);
                setTimeout(() => setSubmissionError(false), 3000);
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div
                    className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
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
                                <div className="rounded-md bg-red-50 p-4">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20"
                                                 fill="currentColor">
                                                <path fillRule="evenodd"
                                                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                                      clipRule="evenodd"/>
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-red-800">
                                                Fixture already assigned to machine. Please select another machine.
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            ) : submitted ? (
                                <div className="rounded-md bg-green-50 p-4">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20"
                                                 fill="currentColor">
                                                <path fillRule="evenodd"
                                                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                      clipRule="evenodd"/>
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-green-800">
                                                Fixture assigned successfully
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <h2 className="text-xl font-semibold leading-6 text-gray-900 mb-6 pb-2 border-b border-gray-200">Assign
                                        Fixture to Machine</h2>

                                    <div className="mb-4">
                                        <h3 className="font-semibold">Selected Fixture:</h3>
                                        <p>Program Name: {fixture?.programName}</p>
                                        <p>Product Name: {fixture?.productName}</p>
                                        <p>Business: {fixture?.business}</p>
                                    </div>

                                    {loading ? (
                                        <p>Loading machines...</p>
                                    ) : error ? (
                                        <div className="rounded-md bg-red-50 p-4">
                                            <div className="flex">
                                                <div className="flex-shrink-0">
                                                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20"
                                                         fill="currentColor">
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
                                                    Select Machine:
                                                </label>
                                                <div className="relative">
                                                    <select
                                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-8"
                                                        value={selectedMachineId}
                                                        onChange={(e) => setSelectedMachineId(e.target.value)}
                                                        required
                                                    >
                                                        <option value="">-- Select a Machine --</option>
                                                        {machines.map((machine) => (
                                                            <option key={machine.id} value={machine.id}>
                                                                {machine.equipmentName}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <div
                                                        className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                                        <svg className="fill-current h-4 w-4"
                                                             xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                            <path
                                                                d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between mt-4">
                                                <button
                                                    type="submit"
                                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                                    disabled={isSubmitting}
                                                >
                                                    {isSubmitting ? 'Assigning...' : 'Assign'}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={onClose}
                                                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssignFixtureToMachineModal;