import React, { useState, useEffect } from 'react';
import MachineService from '../services/MachineService';

const AssignFixtureToMachineModal = ({ fixture, isOpen, onClose, onAssign }) => {
    const [machines, setMachines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedMachineId, setSelectedMachineId] = useState('');

    useEffect(() => {
        if (isOpen) {
            fetchMachines();
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
        if (selectedMachineId) {
            onAssign(fixture.id, selectedMachineId);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Assign Fixture to Machine</h2>

                <div className="mb-4">
                    <h3 className="font-semibold">Selected Fixture:</h3>
                    <p>ID: {fixture?.id}</p>
                    <p>Name: {fixture?.fileName || 'N/A'}</p>
                    <p>Product: {fixture?.productName || 'N/A'}</p>
                </div>

                {loading ? (
                    <p>Loading machines...</p>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block mb-2">Select Machine:</label>
                            <select
                                className="w-full p-2 border rounded"
                                value={selectedMachineId}
                                onChange={(e) => setSelectedMachineId(e.target.value)}
                                required
                            >
                                <option value="">-- Select a Machine --</option>
                                {machines.map(machine => (
                                    <option key={machine.id} value={machine.id}>
                                        {machine.equipmentName} - {machine.serialNumber} ({machine.hostname || 'No hostname'})
                                    </option>
                                ))}
                            </select>
                            {machines.length === 0 && (
                                <p className="text-sm text-gray-500 mt-1">No machines available.</p>
                            )}
                        </div>

                        <div className="flex justify-end space-x-2">
                            <button
                                type="button"
                                className="px-4 py-2 bg-gray-300 rounded"
                                onClick={onClose}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-500 text-white rounded"
                                disabled={!selectedMachineId}
                            >
                                Assign
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default AssignFixtureToMachineModal;