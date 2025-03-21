import React, {useState, useEffect} from 'react';
import MachineService from '../../services/MachineService';
import {
    AddMachineForm,
    useHoverBadge,
    DeleteModal,
    MachineListErrorMessage,
    ModalDialogAddEditForm,
    MachineTable
} from '.';

const MachineList = () => {
    const [machines, setMachines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [editingMachine, setEditingMachine] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredMachines, setFilteredMachines] = useState([]);
    const [fixtureMap, setFixtureMap] = useState({});

    useEffect(() => {
        fetchMachines();
        fetchFixtureMap();
    }, []);

    // Set up the hover badge functionality
    const getFixtureCount = (machineId) => {
        return fixtureMap[machineId] || 0;
    };

    const {getRowProps, getBadge} = useHoverBadge({
        rows: filteredMachines,
        getCountFunction: getFixtureCount,
        countLabel: 'fixtures',
        idKey: 'id'
    });

    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredMachines(machines);
            return;
        }

        const lowercasedTerm = searchTerm.toLowerCase();
        const filtered = machines.filter(machine =>
            (machine.equipmentName && machine.equipmentName.toLowerCase().includes(lowercasedTerm)) ||
            (machine.internalFactory !== undefined && String(machine.internalFactory).toLowerCase().includes(lowercasedTerm)) ||
            (machine.serialNumber && machine.serialNumber.toLowerCase().includes(lowercasedTerm)) ||
            (machine.equipmentType && machine.equipmentType.toLowerCase().includes(lowercasedTerm)) ||
            (machine.hostname && machine.hostname.toLowerCase().includes(lowercasedTerm))
        );

        setFilteredMachines(filtered);
    }, [searchTerm, machines]);

    const fetchMachines = () => {
        console.log('Attempting to fetch machines...');
        MachineService.getAllMachines()
            .then(response => {
                console.log('Machines fetched successfully:', response.data);
                setMachines(response.data);
                setFilteredMachines(response.data); // Initialize filteredMachines with all machines
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching machines:', error);
                if (error.response) {
                    console.error('Response data:', error.response.data);
                    console.error('Response status:', error.response.status);
                } else if (error.request) {
                    console.error('No response received:', error.request);
                } else {
                    console.error('Error message:', error.message);
                }
                setError('Failed to fetch machines. Please try again later.');
                setLoading(false);
            });
    };

    const fetchFixtureMap = () => {
        MachineService.getFixtureMachineMap()
            .then(response => {
                console.log('Fixture map fetched successfully:', response.data);
                setFixtureMap(response.data);
            })
            .catch(error => {
                console.error('Error fetching fixture map:', error);
            });
    };

    const handleMachineAdded = (newMachine) => {
        setMachines([...machines, newMachine]);
        fetchMachines()
        setShowAddForm(false); // close the form after adding
    };

    const toggleAddForm = () => {
        setEditingMachine(null);
        setShowAddForm(!showAddForm);
    };

    const handleDelete = (id) => {
        setDeleteConfirm(id);
    };

    const confirmDelete = () => {
        if (deleteConfirm) {
            setError(null);
            MachineService.deleteMachine(deleteConfirm)
                .then(() => {
                    setMachines(machines.filter(machine => machine.id !== deleteConfirm));
                    setDeleteConfirm(null);
                })
                .catch(err => {
                    console.error("Error deleting machine:", err);
                    setError("Failed to delete machine. Please try again.");
                    setDeleteConfirm(null);
                });
        }
    };

    const cancelDelete = () => {
        setDeleteConfirm(null);
    };

    const handleEdit = (machine) => {
        setEditingMachine({...machine});
        setShowAddForm(true);
    };

    const handleMachineUpdated = (updatedMachine) => {
        setMachines(machines.map(machine => machine.id === updatedMachine.id ? updatedMachine : machine));
        setEditingMachine(null);
        setShowAddForm(false); // close the form after updating
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-pulse">
                    <div
                        className="h-12 w-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <h3 className="ml-3 text-xl font-medium text-gray-700">Loading machines...</h3>
            </div>
        );
    }

    if (error) {
        return <MachineListErrorMessage
            message={error}
            onRetry={fetchMachines}
        />;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="max-w-4xl mx-auto">
                <div className="sm:flex sm:items-center sm:justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Machine Management System</h1>

                        <div className="mb-4">
                            <div className="flex">
                                <input
                                    type="text"
                                    placeholder="Search"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="px-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="ml-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none"
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 sm:mt-0">
                        <button
                            onClick={toggleAddForm}
                            className={`inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white
                      ${showAddForm && !editingMachine
                                ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                                : 'bg-primary-600 hover:bg-primary-700 focus:ring-primary-500'
                            } focus:outline-none focus:ring-2 focus:ring-offset-2`}
                        >
                            {showAddForm && !editingMachine ? (
                                <>
                                    <svg className="h-4 w-4 mr-1.5" fill="none" stroke="currentColor"
                                         viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                              d="M6 18L18 6M6 6l12 12"/>
                                    </svg>
                                    Cancel
                                </>
                            ) : (
                                <>
                                    <svg className="h-4 w-4 mr-1.5" fill="none" stroke="currentColor"
                                         viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                              d="M12 4v16m8-8H4"/>
                                    </svg>
                                    Add New Machine
                                </>
                            )}
                        </button>
                    </div>
                </div>

                <ModalDialogAddEditForm isOpen={showAddForm} onClose={toggleAddForm}>
                    <AddMachineForm
                        onMachineAdded={handleMachineAdded}
                        onMachineUpdated={handleMachineUpdated}
                        editMachine={editingMachine}
                        onCancel={toggleAddForm}
                    />
                </ModalDialogAddEditForm>

                <MachineTable
                    machines={machines}
                    filteredMachines={filteredMachines}
                    getRowProps={getRowProps}
                    getBadge={getBadge}
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                />

                <div className="mt-4 text-center text-xs text-gray-500">
                    Showing {filteredMachines.length} machines in total
                </div>

                <DeleteModal
                    isOpen={deleteConfirm !== null}
                    onDelete={confirmDelete}
                    onCancel={cancelDelete}
                    title="Delete Machine"
                    message="Are you sure you want to delete this machine? This action cannot be undone."
                />
            </div>
        </div>
    )
        ;
};

export default MachineList;