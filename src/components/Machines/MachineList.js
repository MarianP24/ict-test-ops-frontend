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
    TableFilterBar, DownloadButton
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
        setShowAddForm(false); // close the form after updating
        setEditingMachine(null);
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
                    setFilteredMachines(filteredMachines.filter(machine => machine.id !== deleteConfirm));
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
    const handleDownloadFilteredData = () => {
        // Early return if no data to download
        if (filteredMachines.length === 0) {
            // You could add a toast notification here if you have a notification system
            console.warn("No data available to export");
            return;
        }

        try {
            // Convert data to CSV
            const csvData = convertMachinesToCSV(filteredMachines);

            // Create a Blob containing the CSV data with UTF-8 BOM for Excel compatibility
            // The \ufeff is a UTF-8 BOM (Byte Order Mark) that helps Excel recognize the CSV as UTF-8
            const blob = new Blob(["\ufeff" + csvData], {type: 'text/csv;charset=utf-8;'});

            // Create and set up the download link
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');

            // Set up the filename with date for better organization
            const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
            let filename = `machines`;

            // Add filter indication if filters are applied
            if (isFiltering) {
                // Get active filter values for the filename
                const activeFilters = Object.entries(filters)
                    .filter(([_, value]) => value && value.trim() !== '')
                    .map(([key, _]) => key.toLowerCase())
                    .join('_');

                if (activeFilters) {
                    filename += `_filtered_by_${activeFilters}`;
                } else {
                    filename += '_filtered';
                }
            }

            filename += `_${date}.csv`;

            // Set link attributes
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';

            // Add to DOM, trigger download, and clean up
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Release the object URL to free memory
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error exporting data:", error);
            // Handle error - you could set an error state here if needed
            setError("Failed to export data. Please try again.");
        }
    };
    const convertMachinesToCSV = (machines) => {
        if (!machines || machines.length === 0) return '';

        // Define custom headers with the display ID
        const headers = ['displayId', ...Object.keys(machines[0]).filter(key =>
            !['__v', 'createdAt', 'updatedAt', 'id'].includes(key)
        )];

        // Create user-friendly header labels
        const headerLabels = headers.map(header => {
            if (header === 'displayId') return 'ID';
            // Convert camelCase to Title Case with spaces
            return header
                .replace(/([A-Z])/g, ' $1') // Add space before capital letters
                .replace(/^./, str => str.toUpperCase()); // Capitalize first letter
        });

        // Create the CSV rows array, starting with headers
        const rows = [headerLabels.join(',')];

        // Add data rows
        for (let i = 0; i < machines.length; i++) {
            const machine = machines[i];
            const values = headers.map(header => {
                // For the displayId, use sequential numbering just like in the table
                if (header === 'displayId') {
                    return i + 1; // Start from 1
                }

                // Get the value, handling null/undefined
                let value = machine[header];

                // Convert null/undefined to empty string
                if (value === null || value === undefined) {
                    return '';
                }

                // Format Date objects
                if (value instanceof Date) {
                    return value.toISOString().split('T')[0]; // YYYY-MM-DD format
                }

                // Convert objects/arrays to JSON strings
                if (typeof value === 'object') {
                    value = JSON.stringify(value);
                }

                // Handle string values that may contain commas, quotes, or newlines
                if (typeof value === 'string') {
                    // Escape quotes by doubling them
                    const escapedValue = value.replace(/"/g, '""');
                    // Wrap in quotes if value contains commas, quotes, or newlines
                    return /[,"\n\r]/.test(value) ? `"${escapedValue}"` : value;
                }

                return value;
            });

            rows.push(values.join(','));
        }

        return rows.join('\n');
    };


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
        <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8 mt-8"> {/* Main container */}
            <div className="max-w-6xl mx-auto"> {/* Table width */}

                <div className="page-header mb-2">{/* Header section */}
                    <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Machine Management System</h1>
                </div>

                <div
                    className="page-controls mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-8">
                    <div className="filters-container w-full">
                        <div className="w-2/5">
                            <TableFilterBar
                                filters={filters}
                                setFilters={setFilters}
                                applyFilters={applyFilters}
                                columns={filterColumns}
                                setIsFiltering={setIsFiltering}
                            />
                        </div>

                        <div className="flex justify-between mt-1">
                            <DownloadButton
                                onClick={handleDownloadFilteredData}
                                label="Export Data"
                            />

                            <AddNewButton
                                label="Add New Machine"
                                onClick={toggleAddForm}
                            />
                        </div>
                    </div>
                </div>

                <div className="page-content mb-8">
                    <MachineTable
                        filteredMachines={filteredMachines}
                        isFiltering={isFiltering}
                        handleEdit={handleEdit}
                        handleDelete={handleDelete}
                        handleViewFixtures={handleViewFixtures}
                    />
                </div>

                {/* Modals */}
                <AddEditModal isOpen={showAddForm} onClose={toggleAddForm}>
                    <AddMachineForm
                        onMachineAdded={handleMachineAdded}
                        onMachineUpdated={handleMachineUpdated}
                        editMachine={editingMachine}
                        onCancel={toggleAddForm}
                    />
                </AddEditModal>

                <FixturesModal
                    isOpen={showFixturesModal}
                    onClose={handleCloseFixturesModal}
                    fixtures={selectedMachineFixtures}
                    machineName={selectedMachineName}
                />

                <DeleteModal
                    isOpen={deleteConfirm !== null}
                    onDelete={confirmDelete}
                    onCancel={cancelDelete}
                    title="Delete Machine"
                    message="Are you sure you want to delete this machine? This action cannot be undone."
                />
            </div>
        </div>
    );
};

export default MachineList;