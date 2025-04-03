import React, {useState, useEffect, useCallback} from 'react';
import MachineService from '../../services/MachineService';

// Machine-specific components
import {
    AddMachineForm,
    MachineTable,
    FixturesModal,
    DeleteModal
} from './machineComponents';

// Shared utility components
import {
    LoadingTableErrorMessage,
    AddEditModal,
    AddNewButton,
    TableFilterBar
} from '../common/sharedComponents';

const MachineList = () => {
    // 1. All state declarations
    const [machines, setMachines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFiltering, setIsFiltering] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [editingMachine, setEditingMachine] = useState(null);
    const [filters, setFilters] = useState({
        equipmentName: '',
        internalFactory: '',
        serialNumber: '',
        equipmentType: '',
        hostname: ''
    });
    const [filteredMachines, setFilteredMachines] = useState([]);
    const [showFixturesModal, setShowFixturesModal] = useState(false);
    const [selectedMachineFixtures, setSelectedMachineFixtures] = useState([]);
    const [selectedMachineName, setSelectedMachineName] = useState('');

    // 2. All function declarations
    const fetchMachines = useCallback(() => {
        console.log('Attempting to fetch machines...');
        setLoading(true);
        setError(null);
        const controller = new AbortController();
        const signal = controller.signal;

        MachineService.getAllMachines(signal)
            .then(response => {
                if (signal.aborted) return;
                console.log('Machines fetched successfully:', response.data);
                setMachines(response.data);
                setFilteredMachines(response.data);
                setLoading(false);
            })
            .catch(error => {
                if (signal.aborted) return;
                console.error('Error fetching machines:', error);
                if (error.response) {
                    console.error('Response data:', error.response.data);
                    console.error('Response status:', error.response.status);
                } else if (error.request) {
                    console.error('No response received:', error.request);
                } else {
                    console.error('Error message:', error.message);
                }
                setError('Failed to fetch machines. Your session may have expired. Please log in again.');
                setLoading(false);
            });

        return () => controller.abort();
    }, []);
    const applyFilters = useCallback((filterValues) => {
        setLoading(true);

        MachineService.getMachinesByFilters(filterValues)
            .then(response => {
                console.log('Filtered machines fetched successfully:', response.data);
                setFilteredMachines(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching filtered machines:', error);
                if (error.response) {
                    console.error('Response data:', error.response.data);
                    console.error('Response status:', error.response.status);
                } else if (error.request) {
                    console.error('No response received:', error.request);
                } else {
                    console.error('Error message:', error.message);
                }
                setError('Failed to apply filters. Please try again later.');
                setLoading(false);
            });
    }, []);

    // 2.1 Modal control functions
    const handleViewFixtures = useCallback((machine) => {
        setLoading(true);
        setSelectedMachineName(machine.equipmentName || `Machine ${machine.id}`);

        MachineService.getMachineFixtures(machine.id)
            .then(response => {
                console.log('Fixtures fetched successfully:', response.data);
                setSelectedMachineFixtures(response.data);
                setShowFixturesModal(true);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching fixtures:', error);
                setError('Failed to fetch fixtures. Please try again later.');
                setLoading(false);
            });
    }, []);
    const handleCloseFixturesModal = () => {
        setShowFixturesModal(false);
    };
    const toggleAddForm = () => {
        setEditingMachine(null);
        setShowAddForm(!showAddForm);
    };
    const filterColumns = [
        {key: 'equipmentName', label: 'Equipment Name'},
        {key: 'internalFactory', label: 'Internal Factory'},
        {key: 'serialNumber', label: 'Serial Number'},
        {key: 'equipmentType', label: 'Equipment Type'},
        {key: 'hostname', label: 'Hostname'}
    ];


    // 2.2 CRUD operation functions
    const handleMachineAdded = (newMachine) => {
        setMachines([...machines, newMachine]);
        fetchMachines();
        setShowAddForm(false); // close the form after adding
    };
    const handleMachineUpdated = (updatedMachine) => {
        setMachines(machines.map(machine => machine.id === updatedMachine.id ? updatedMachine : machine));
        fetchMachines();
        setEditingMachine(null);
        setShowAddForm(false); // close the form after updating
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
    }

    // 3. useEffect hooks
    useEffect(() => {
        fetchMachines();
    }, [fetchMachines]);

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
        return <LoadingTableErrorMessage
            message={error}
            onRetry={fetchMachines}
        />;
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-8"> {/* Main container */}
            {/* Header section */}
            <div className="max-w-4xl mx-auto">
                <div className="sm:flex sm:items-center sm:justify-between mb-8">

                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Machine Management System</h1>

                        <TableFilterBar
                            filters={filters}
                            setFilters={setFilters}
                            applyFilters={applyFilters}
                            columns={filterColumns}
                            setIsFiltering={setIsFiltering}
                        />

                    </div>

                    <div className="mt-4 sm:mt-0">
                        <AddNewButton
                            label="Add New Machine"
                            onClick={toggleAddForm}
                        />
                    </div>

                </div>

                <AddEditModal isOpen={showAddForm} onClose={toggleAddForm}>
                    <AddMachineForm
                        onMachineAdded={handleMachineAdded}
                        onMachineUpdated={handleMachineUpdated}
                        editMachine={editingMachine}
                        onCancel={toggleAddForm}
                    />
                </AddEditModal>

                <MachineTable
                    machines={machines}
                    filteredMachines={filteredMachines}
                    isFiltering={isFiltering}
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                    handleViewFixtures={handleViewFixtures}
                />

                <FixturesModal
                    isOpen={showFixturesModal}
                    onClose={handleCloseFixturesModal}
                    fixtures={selectedMachineFixtures}
                    machineName={selectedMachineName}
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