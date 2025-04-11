import React, {useState, useEffect, useCallback} from 'react';
import FixtureService from '../../services/FixtureService';
import FixtureAssignedMachinesModal from "./FixtureAssignedMachineModal";

// Fixture specific components
import {
    AddFixtureForm,
    FixtureTable,
    AssignFixtureToMachineModal,
    DeleteModal
} from './fixtureComponents';

// Shared utility components
import {
    LoadingTableErrorMessage,
    AddEditModal,
    AddNewButton,
    MaintenanceReportAllButton,
    TableFilterBar, DownloadButton
} from '../common/sharedComponents';


const FixtureList = () => {
    // 1. All state declarations
    const [fixtures, setFixtures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFiltering, setIsFiltering] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [editingFixture, setEditingFixture] = useState(null);
    const [filters, setFilters] = useState({
        programName: '',
        fileName: '',
        productName: '',
        business: '',
        fixtureCounterSet: ''
    });
    const [filteredFixtures, setFilteredFixtures] = useState([]);
    const [sortField, setSortField] = useState('id'); // Default sort field
    const [sortDirection, setSortDirection] = useState('asc');
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedFixture, setSelectedFixture] = useState(null);

    const [showMachinesModal, setShowMachinesModal] = useState(false);
    const [selectedFixtureMachines, setSelectedFixtureMachines] = useState([]);
    const [selectedFixtureName, setSelectedFixtureName] = useState('');


    // 2. All function declarations
    const fetchFixtures = useCallback(() => {
        console.log('Attempting to fetch fixtures...');
        setLoading(true);
        setError(null);
        const controller = new AbortController();
        const signal = controller.signal;

        FixtureService.getAllFixtures(signal)
            .then(response => {
                if (signal.aborted) return;
                console.log('Fixtures fetched successfully:', response.data);
                setFixtures(response.data);
                setFilteredFixtures(response.data);
                setLoading(false);
            })
            .catch(error => {
                if (signal.aborted) return;
                console.error('Error fetching fixtures:', error);
                if (error.response) {
                    console.error('Response data:', error.response.data);
                    console.error('Response status:', error.response.status);
                } else if (error.request) {
                    console.error('No response received:', error.request);
                } else {
                    console.error('Error message:', error.message);
                }
                setError('Failed to fetch fixtures. Your session may have expired. Please log in again.');
                setLoading(false);
            });

        return () => controller.abort();
    }, []);
    const applyFilters = useCallback((filterValues) => {
        setLoading(true);

        FixtureService.getFixturesByFilters(filterValues)
            .then(response => {
                console.log('Filtered fixtures fetched successfully:', response.data);
                setFilteredFixtures(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching filtered fixtures:', error);
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
    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            // If switching to a new field, set it to ascending by default
            setSortField(field);
            setSortDirection('asc');
        }
    };
    const toggleAddForm = () => {
        setEditingFixture(null);
        setShowAddForm(!showAddForm);
    };
    const filterColumns = [
        {key: 'programName', label: 'Program Name'},
        {key: 'fileName', label: 'File Name'},
        {key: 'productName', label: 'Product Name'},
        {key: 'business', label: 'Business'},
        {key: 'fixtureCounterSet', label: 'Counter Set'}
    ];
    const handleAssignToMachine = (fixture) => {
        setSelectedFixture(fixture);
        setShowAssignModal(true);
    };
    const handleAssignFixture = (fixtureId, machineId) => {
        return FixtureService.addFixtureToMachine(fixtureId, machineId)
            .then(() => {
                // Close the modal after a short delay to show the success message
                setTimeout(() => {
                    setShowAssignModal(false);
                }, 2000);

                return {success: true};
            })
            .catch(error => {
                console.error('Error assigning fixture:', error);
                // Re-throw the error so it can be caught by the modal's error handler
                throw error;
            });
    };

    const handleViewMachines = useCallback((fixture) => {
        setLoading(true);
        setSelectedFixtureName(fixture.programName || `Fixture ${fixture.id}`);

        FixtureService.getFixtureMachineMap(fixture.id)
            .then(response => {
                console.log('Machines fetched successfully:', response.data);
                setSelectedFixtureMachines(response.data);
                setShowMachinesModal(true);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching machines:', error);
                setError('Failed to fetch machines. Please try again later.');
                setLoading(false);
            });
    }, []);

    const handleCloseMachinesModal = () => {
        setShowMachinesModal(false);
    };


    // 2.2 CRUD operation functions
    const handleFixtureAdded = (newFixture) => {
        setFixtures([...fixtures, newFixture]);
        fetchFixtures();
        setShowAddForm(false);
    };
    const handleFixtureUpdated = (updatedFixture) => {
        setFixtures(fixtures.map(fixture => fixture.id === updatedFixture.id ? updatedFixture : fixture));
        fetchFixtures();
        setShowAddForm(false);
        setEditingFixture(null);
    };
    const handleDelete = (id) => {
        setDeleteConfirm(id);
    };
    const confirmDelete = () => {
        if (deleteConfirm) {
            setError(null);
            FixtureService.deleteFixture(deleteConfirm)
                .then(() => {
                    setFixtures(fixtures.filter(fixture => fixture.id !== deleteConfirm));
                    setDeleteConfirm(null);
                })
                .catch(err => {
                    console.error("Error deleting fixture:", err);
                    setError("Failed to delete fixture. Please try again.");
                    setDeleteConfirm(null);
                });
        }
    };
    const cancelDelete = () => {
        setDeleteConfirm(null);
    };
    const handleEdit = (fixture) => {
        setEditingFixture({...fixture});
        setShowAddForm(true);
    };
    const handleCreateMaintenanceReport = () => {
        FixtureService.createMaintenanceFixtureReport()
            .then(() => {
                // Handle success
                alert("Maintenance report created successfully");
                // Optionally refresh the fixtures list
                fetchFixtures();
            })
            .catch(error => {
                console.error("Error creating maintenance report:", error);
                setError("Failed to create maintenance report. Please try again.");
            });
    };
    const handleDownloadFilteredData = () => {
        // Early return if no data to download
        if (filteredFixtures.length === 0) {
            // You could add a toast notification here if you have a notification system
            console.warn("No data available to export");
            return;
        }

        try {
            // Convert data to CSV
            const csvData = convertFixturesToCSV(filteredFixtures);

            // Create a Blob containing the CSV data with UTF-8 BOM for Excel compatibility
            // The \ufeff is a UTF-8 BOM (Byte Order Mark) that helps Excel recognize the CSV as UTF-8
            const blob = new Blob(["\ufeff" + csvData], {type: 'text/csv;charset=utf-8;'});

            // Create and set up the download link
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');

            // Set up the filename with date for better organization
            const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
            let filename = `fixtures`;

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
    const convertFixturesToCSV = (fixtures) => {
        if (!fixtures || fixtures.length === 0) return '';

        // Define custom headers with the display ID
        const firstFixture = fixtures[0];
        const headers = ['displayId', ...Object.keys(firstFixture).filter(key =>
            // Exclude certain fields you don't want in the export, including the actual id
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
        for (let i = 0; i < fixtures.length; i++) {
            const fixture = fixtures[i];
            const values = headers.map(header => {
                // For the displayId, use sequential numbering
                if (header === 'displayId') {
                    return i + 1; // Start from 1
                }

                // Get the value, handling null/undefined
                let value = fixture[header];

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
        fetchFixtures();
    }, [fetchFixtures]);
    useEffect(() => {
        if (!fixtures.length) return;

        // Sort without modifying filteredFixtures
        const applySort = (data) => {
            const compareCounterValues = (a, b) => {
                const aValue = a[sortField];
                const bValue = b[sortField];

                // Handle null values
                if (aValue === null && bValue === null) return 0;
                if (aValue === null) return sortDirection === 'asc' ? -1 : 1;
                if (bValue === null) return sortDirection === 'asc' ? 1 : -1;

                return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
            };

            return [...data].sort(compareCounterValues);
        };

        setFilteredFixtures(applySort(fixtures));
    }, [sortField, sortDirection, fixtures]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-pulse">
                    <div
                        className="h-12 w-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <h3 className="ml-3 text-xl font-medium text-gray-700">Loading fixtures...</h3>
            </div>
        );
    }

    if (error) {
        return <LoadingTableErrorMessage
            message={error}
            onRetry={fetchFixtures}
        />;
    }

    return (
        <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8 mt-8"> {/* Main container */}
            <div className="max-w-6xl mx-auto"> {/* Table width */}

                <div className="page-header mb-2 ">{/* Header section with flex */}
                    <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Fixture Management System</h1>
                </div>

                <div
                    className="page-controls mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-8">
                    <div className="filters-container w-full flex flex-col sm:flex-row sm:justify-between items-start">
                        {/* Left section with filter and download  */}
                        <div className="flex flex-col w-full md:w-6/12 lg:w-5/12">
                            <div className="w-full">
                                <TableFilterBar
                                    filters={filters}
                                    setFilters={setFilters}
                                    applyFilters={applyFilters}
                                    columns={filterColumns}
                                    setIsFiltering={setIsFiltering}
                                />
                            </div>
                            <div className="self-start">
                                <DownloadButton
                                    onClick={handleDownloadFilteredData}
                                    label="Export Data"
                                    className="text-sm px-3 py-2.5"
                                />
                            </div>
                        </div>

                        {/* Right section with Maintenance and AddNewButton  */}
                        <div className="flex flex-col space-y-1 items-center">
                            <MaintenanceReportAllButton
                                label="Create Maintenance Report"
                                onClick={handleCreateMaintenanceReport}
                            />
                            <div className="flex justify-end w-full">
                                <AddNewButton
                                    label="Add New Machine"
                                    onClick={toggleAddForm}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="page-content mb-8">
                    <FixtureTable
                        filteredFixtures={filteredFixtures}
                        isFiltering={isFiltering}
                        sortField={sortField}
                        sortDirection={sortDirection}
                        handleSort={handleSort}
                        handleEdit={handleEdit}
                        handleDelete={handleDelete}
                        handleAssignToMachine={handleAssignToMachine}
                        handleViewMachines={handleViewMachines}
                    />
                </div>

                {/* Modals */}
                <AddEditModal isOpen={showAddForm} onClose={toggleAddForm}>
                    <AddFixtureForm
                        onFixtureAdded={handleFixtureAdded}
                        onFixtureUpdated={handleFixtureUpdated}
                        editFixture={editingFixture}
                        onCancel={toggleAddForm}
                    />
                </AddEditModal>

                <DeleteModal
                    isOpen={deleteConfirm !== null}
                    onDelete={confirmDelete}
                    onCancel={cancelDelete}
                    title="Delete Fixture"
                    message="Are you sure you want to delete this fixture? This action cannot be undone."
                />

                <AssignFixtureToMachineModal
                    fixture={selectedFixture}
                    isOpen={showAssignModal}
                    onClose={() => setShowAssignModal(false)}
                    onAssign={handleAssignFixture}
                />

                <FixtureAssignedMachinesModal
                    isOpen={showMachinesModal}
                    onClose={handleCloseMachinesModal}
                    machines={selectedFixtureMachines}
                    fixtureName={selectedFixtureName}
                />

            </div>
        </div>
    );
};

export default FixtureList;