import React, {useState, useEffect, useCallback} from 'react';
import FixtureService from '../../services/FixtureService';

// Fixture specific components
import {
    AddFixtureForm,
    FixtureTable,
    AssignFixtureToMachineModal
} from './fixtureComponents';

// UI structure components
import {
    DeleteModal
} from './fixtureComponents';

// Shared utility components
import {
    LoadingTableErrorMessage,
    AddEditModal,
    SearchField,
    AddNewButton
} from '../common/sharedComponents';

const FixtureList = () => {
    // 1. All state declarations
    const [fixtures, setFixtures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [editingFixture, setEditingFixture] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
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
        let result = [...fixtures];

        // Apply search filtering if needed
        if (searchTerm.trim()) {
            const lowercasedTerm = searchTerm.toLowerCase();
            result = result.filter(fixture =>
                (fixture.fileName && fixture.fileName.toLowerCase().includes(lowercasedTerm)) ||
                (fixture.programName && fixture.programName.toLowerCase().includes(lowercasedTerm)) ||
                (fixture.productName && fixture.productName.toLowerCase().includes(lowercasedTerm)) ||
                (fixture.business && fixture.business.toLowerCase().includes(lowercasedTerm))
            );
        }

        result.sort((a, b) => {
            if (sortField === 'id') {
                return sortDirection === 'asc' ? a.id - b.id : b.id - a.id;
            } else if (sortField === 'counter') {
                return sortDirection === 'asc' ? a.counter - b.counter : b.counter - a.counter;
            }
            return 0;
        });

        setFilteredFixtures(result);
    }, [fixtures, searchTerm, sortField, sortDirection]);

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

                    <SearchField
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        placeholder="Search fixtures"
                    />

                </div>

                <div className="mt-4 sm:mt-0 flex flex-col space-y-2">
                    <AddNewButton
                        onClick={toggleAddForm}
                        label="Add New Fixture"
                    />

                    <button
                        onClick={handleCreateMaintenanceReport}
                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <svg className="h-4 w-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                        </svg>
                        Generate Maintenance Report
                    </button>
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
                fixtures={fixtures}
                filteredFixtures={filteredFixtures}
                sortField={sortField}
                sortDirection={sortDirection}
                handleSort={handleSort}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                handleAssignToMachine={handleAssignToMachine}
            />

            <div className="mt-4 text-center text-xs text-gray-500">
                Showing {filteredFixtures.length} fixtures in total
            </div>

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