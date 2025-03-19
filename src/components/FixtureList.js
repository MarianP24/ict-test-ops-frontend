import React, {useState, useEffect} from 'react';
import FixtureService from '../services/FixtureService';
// import AuthService from '../services/AuthService';
import AddFixtureForm from './AddFixtureForm';

const FixtureList = () => {
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


    useEffect(() => {
        fetchFixtures();
    }, []);

    useEffect(() => {
        // Start with the fixtures array and apply filtering first
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

        // Then apply sorting
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


    const handleSort = (field) => {
        // If clicking on the same field, toggle direction
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            // If switching to a new field, set it to ascending by default
            setSortField(field);
            setSortDirection('asc');
        }
    };

    // useEffect(() => {
    //     if (!filteredFixtures.length) return;
    //
    //     const sorted = [...filteredFixtures].sort((a, b) => {
    //         if (sortField === 'id') {
    //             // For numeric sorting of IDs
    //             return sortDirection === 'asc'
    //                 ? a.id - b.id
    //                 : b.id - a.id;
    //         } else if (sortField === 'counter') {
    //             // For numeric sorting of counters
    //             return sortDirection === 'asc'
    //                 ? a.counter - b.counter
    //                 : b.counter - a.counter;
    //         }
    //         return 0;
    //     });
    //
    //     setFilteredFixtures(sorted);
    // }, [sortField, sortDirection, fixtures, searchTerm]);

    const fetchFixtures = () => {
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
                setError('Failed to fetch fixtures. Please try again later.');
                setLoading(false);
            });
    };

    const handleFixtureAdded = (newFixture) => {
        setFixtures([...fixtures, newFixture]);
        fetchFixtures();
        setShowAddForm(false);
    };

    const toggleAddForm = () => {
        setEditingFixture(null);
        setShowAddForm(!showAddForm);
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

    const handleFixtureUpdated = (updatedFixture) => {
        setFixtures(fixtures.map(fixture => fixture.id === updatedFixture.id ? updatedFixture : fixture));
        setShowAddForm(false);
        setEditingFixture(null);
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
        return (
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded-md">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd"
                                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                      clipRule="evenodd"/>
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
                <button
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    onClick={fetchFixtures}
                >
                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                    </svg>
                    Retry
                </button>
            </div>
        );
    }

    // Get current user from auth service
    // const currentUser = AuthService.getCurrentUser();

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-8"> {/* Main container */}
            {/* Header section */}
            <div className="sm:flex sm:items-center sm:justify-between mb-8">

                <div>
                    <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Fixture Management System</h1>

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

                <div className="mt-4 sm:mt-0 flex flex-col space-y-2">
                    <button
                        onClick={toggleAddForm}
                        className={`inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white
                      ${showAddForm && !editingFixture
                            ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                            : 'bg-primary-600 hover:bg-primary-700 focus:ring-primary-500'
                        } focus:outline-none focus:ring-2 focus:ring-offset-2`}
                    >
                        {showAddForm && !editingFixture ? (
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
                                Add New Fixture
                            </>
                        )}
                    </button>

                    {/* Generate Maintenance Report button */}
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

            {/* Modal Dialog for Add/Edit Form */}
            {showAddForm && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div
                        className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>

                        {/* This element centers the modal contents. */}
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen"
                              aria-hidden="true">&#8203;</span>

                        <div
                            className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
                            <div className="absolute top-0 right-0 pt-4 pr-4 z-10">
                                <button
                                    type="button"
                                    onClick={toggleAddForm}
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
                                <AddFixtureForm
                                    onFixtureAdded={handleFixtureAdded}
                                    onFixtureUpdated={handleFixtureUpdated}
                                    editFixture={editingFixture}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="overflow-x-auto shadow-xl rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                    <tr className="bg-gradient-to-r from-primary-600 to-primary-800">
                        <th scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider rounded-tl-lg cursor-pointer hover:bg-primary-700"
                            onClick={() => handleSort('id')}>
                            ID
                            {sortField === 'id' && (
                                <span className="ml-1">
                                {sortDirection === 'asc' ? '↑' : '↓'}
                                 </span>
                            )}
                        </th>
                        <th scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                            Program Name
                        </th>
                        <th scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                            File Name
                        </th>
                        <th scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                            Product Name
                        </th>
                        <th scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                            Business
                        </th>
                        <th scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                            Counter Set
                        </th>
                        <th scope="col"
                            className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider cursor-pointer hover:bg-primary-700"
                            onClick={() => handleSort('counter')}>
                        Counter
                            {sortField === 'counter' && (
                                <span className="ml-1">
                                    {sortDirection === 'asc' ? '↑' : '↓'}
                                </span>
                            )}
                        </th>
                        <th scope="col"
                            className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider rounded-tr-lg">
                            Actions
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {fixtures.length > 0 ? (
                        filteredFixtures.map((fixture, index) => (
                            <tr
                                key={fixture.id}
                                className="hover:bg-gray-50 transition-colors duration-200"
                            >
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{fixture.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{fixture.fileName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{fixture.programName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{fixture.productName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{fixture.business}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{fixture.fixtureCounterSet}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{fixture.counter}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        className="text-primary-600 hover:text-primary-900 mr-4 transition duration-150 ease-in-out"
                                        title="Edit fixture"
                                        onClick={() => handleEdit(fixture)}
                                    >
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor"
                                             viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                  strokeWidth="2"
                                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                        </svg>
                                    </button>
                                    <button
                                        className="text-red-600 hover:text-red-900 transition duration-150 ease-in-out"
                                        title="Delete fixture"
                                        onClick={() => handleDelete(fixture.id)}
                                    >
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor"
                                             viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                  strokeWidth="2"
                                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7"
                                className="px-6 py-12 whitespace-nowrap text-center text-base text-gray-500">
                                <svg className="mx-auto h-12 w-12 text-gray-300" fill="none"
                                     stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1"
                                          d="M15.536 7.536a5 5 0 022.828 2.828m-2.828-2.828l-6.364 6.364m-3.536-3.536a5 5 0 002.828 2.828m-2.828-2.828L9 14"/>
                                </svg>
                                <p className="mt-2">No fixtures found</p>
                                <p className="mt-1 text-sm">Add a new fixture to get started</p>
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 text-center text-xs text-gray-500">
                Showing {filteredFixtures.length} fixtures in total
            </div>


            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div
                        className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>

                        {/* This element centers the modal contents. */}
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen"
                              aria-hidden="true">&#8203;</span>

                        <div
                            className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div
                                        className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                        <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor"
                                             viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                                        </svg>
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">Delete
                                            Fixture</h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                Are you sure you want to delete this fixture? This action cannot be
                                                undone.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={confirmDelete}
                                >
                                    Delete
                                </button>
                                <button
                                    type="button"
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={cancelDelete}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FixtureList;