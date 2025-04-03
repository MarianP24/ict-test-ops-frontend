import React, {useState, useEffect, useCallback} from 'react';
import FixtureService from '../../services/FixtureService';

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
    TableFilterBar
} from '../common/sharedComponents';

const FixtureList = () => {
    // 1. All state declarations
    const [fixtures, setFixtures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [editingFixture, setEditingFixture] = useState(null);
    const [filters, setFilters] = useState({
        programName: '',
        fileName: '',
        productName: '',
        business: '',
        fixtureCounterSet:''
    });
    const [filteredFixtures, setFilteredFixtures] = useState([]);
    const [sortField, setSortField] = useState('id'); // Default sort field
    const [sortDirection, setSortDirection] = useState('asc');
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedFixture, setSelectedFixture] = useState(null);

    // 2. All function declarations
    const fetchFixtures = useCallback(() => {
        console.log('Attempting to fetch fixtures...');
        FixtureService.getAllFixtures()
            .then(response => {
                console.log('Fixtures fetched successfully:', response.data);
                setFixtures(response.data);
                setFilteredFixtures(response.data);
                setLoading(false);
            })
            .catch(error => {
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

    // 3. useEffect hooks
    useEffect(() => {
        fetchFixtures();
    }, [fetchFixtures]);
    useEffect(() => {
        if (!fixtures.length) return;

        const compareCounterValues = (a, b) => {
            const aValue = a[sortField];
            const bValue = b[sortField];

            // Handle null values
            if (aValue === null && bValue === null) return 0;
            if (aValue === null) return sortDirection === 'asc' ? -1 : 1;
            if (bValue === null) return sortDirection === 'asc' ? 1 : -1;

            return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
        };

        const sortedFixtures = [...filteredFixtures].sort(compareCounterValues);

        setFilteredFixtures(sortedFixtures);
    }, [sortField, sortDirection, filteredFixtures, fixtures.length]);

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
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-8"> {/* Main container */}
            {/* Header section */}
            <div className="sm:flex sm:items-center sm:justify-between mb-8">

                <div>
                    <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Fixture Management System</h1>

                    <TableFilterBar
                        filters={filters}
                        setFilters={setFilters}
                        applyFilters={applyFilters}
                        columns={filterColumns}
                    />

                </div>

                <div className="mt-4 sm:mt-0 flex flex-col space-y-2">
                    <AddNewButton
                        label="Add New Fixture"
                        onClick={toggleAddForm}
                    />

                    <MaintenanceReportAllButton
                        label="Create Maintenance Report"
                        onClick={handleCreateMaintenanceReport}
                    />

                </div>
            </div>

            <AddEditModal isOpen={showAddForm} onClose={toggleAddForm}>
                <AddFixtureForm
                    onFixtureAdded={handleFixtureAdded}
                    onFixtureUpdated={handleFixtureUpdated}
                    editFixture={editingFixture}
                    onCancel={toggleAddForm}
                />
            </AddEditModal>

            <FixtureTable
                filteredFixtures={filteredFixtures}
                sortField={sortField}
                sortDirection={sortDirection}
                handleSort={handleSort}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                handleAssignToMachine={handleAssignToMachine}
            />

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
        </div>
    );
};

export default FixtureList;