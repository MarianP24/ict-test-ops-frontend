import React, { useState, useEffect, useCallback } from 'react';
import VpnServerService from '../../services/VpnServerService';

// Vpn Server-specific components
import {
    AddVpnServerForm,
    VpnServerTable,
    DeleteModal,
    VpnAssignedMachineModal
} from './vpnServerComponents';

// Shared utility components
import {
    LoadingTableErrorMessage,
    AddEditModal,
    AddNewButton,
    TableFilterBar,
    DownloadButton
} from '../common/sharedComponents';

const VpnServerList = () => {
    // 1. State declarations
    const [vpnServers, setVpnServers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFiltering, setIsFiltering] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [editingVpnServer, setEditingVpnServer] = useState(null);
    const [filters, setFilters] = useState({
        vpnName: '',
        serverAddress: '',
        destinationNetwork: '',
    });
    const [filteredVpnServers, setFilteredVpnServers] = useState([]);
    const [showConnectedMachinesModal, setShowConnectedMachinesModal] = useState(false);
    const [selectedVpnServerMachines, setSelectedVpnServerMachines] = useState([]);
    const [selectedVpnServerName, setSelectedVpnServerName] = useState('');

    // 2. Function declarations
    const fetchVpnServers = useCallback(() => {
        console.log('Attempting to fetch VPN servers...');
        setLoading(true);
        setError(null);
        const controller = new AbortController();
        const signal = controller.signal;

        VpnServerService.getAllVpnServers(signal)
            .then(response => {
                if (signal.aborted) return;
                console.log('VPN servers fetched successfully:', response.data);
                setVpnServers(response.data);
                setFilteredVpnServers(response.data);
                setLoading(false);
            })
            .catch(error => {
                if (signal.aborted) return;
                console.error('Error fetching VPN servers:', error);
                if (error.response) {
                    console.error('Response data:', error.response.data);
                    console.error('Response status:', error.response.status);
                } else if (error.request) {
                    console.error('No response received:', error.request);
                } else {
                    console.error('Error message:', error.message);
                }
                setError('Failed to fetch VPN servers. Your session may have expired. Please log in again.');
                setLoading(false);
            });

        return () => controller.abort();
    }, []);
    const applyFilters = useCallback((filterValues) => {
        setLoading(true);

        VpnServerService.getVpnServersByFilters(filterValues)
            .then(response => {
                console.log('Filtered VPN servers fetched successfully:', response.data);
                setFilteredVpnServers(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching filtered VPN servers:', error);
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
    const handleViewMachines = useCallback((vpnServer) => {
        setLoading(true);
        setSelectedVpnServerName(vpnServer.vpnName || `VPN Server ${vpnServer.id}`);

        VpnServerService.getVpnServerMachines(vpnServer.id)
            .then(response => {
                console.log('Connected machines fetched successfully:', response.data);
                setSelectedVpnServerMachines(response.data);
                setShowConnectedMachinesModal(true);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching connected machines:', error);
                setError('Failed to fetch connected machines. Please try again.');
                setLoading(false);
            });
    }, []);
    const toggleAddForm = () => {
        setEditingVpnServer(null);
        setShowAddForm(!showAddForm);
    };
    const filterColumns = [
        {key: 'vpnName', label: 'VPN Name'},
        {key: 'serverAddress', label: 'Server Address'},
        {key: 'destinationNetwork', label: 'Destination Network'},
    ];

    // 2.2 CRUD operation functions
    const handleVpnServerAdded = (newVpnServer) => {
        setVpnServers([...vpnServers, newVpnServer]);
        fetchVpnServers();
        setShowAddForm(false); // close the form after adding
    };
    const handleVpnServerUpdated = (updatedVpnServer) => {
        setVpnServers(vpnServers.map(vpnServer => vpnServer.id === updatedVpnServer.id ? updatedVpnServer : vpnServer));
        fetchVpnServers();
        setShowAddForm(false); // close the form after updating
        setEditingVpnServer(null);
    };
    const handleDelete = (id) => {
        setDeleteConfirm(id);
    };
    const confirmDelete = () => {
        if (!deleteConfirm) return;

        setLoading(true);
        VpnServerService.deleteVpnServer(deleteConfirm)
            .then(() => {
                fetchVpnServers();
                setDeleteConfirm(null);
            })
            .catch(error => {
                console.error('Error deleting VPN server:', error);
                setError('Failed to delete VPN server. Please try again later.');
                setLoading(false);
            });
    };
    const cancelDelete = () => {
        setDeleteConfirm(null);
    };
    const handleEdit = (vpnServer) => {
        setEditingVpnServer(vpnServer);
        setShowAddForm(true);
    };
    const convertVpnServersToCSV = (vpnServers) => {
        if (!vpnServers || vpnServers.length === 0) return '';

        // Define custom headers with the display ID
        const headers = ['displayId', ...Object.keys(vpnServers[0]).filter(key =>
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
        for (let i = 0; i < vpnServers.length; i++) {
            const vpnServer = vpnServers[i];
            const values = headers.map(header => {
                // For the displayId, use sequential numbering just like in the table
                if (header === 'displayId') {
                    return i + 1; // Start from 1
                }

                // Get the value, handling null/undefined
                let value = vpnServer[header];

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
    const handleDownloadFilteredData = () => {
        // Early return if no data to download
        if (filteredVpnServers.length === 0) {
            // You could add a toast notification here if you have a notification system
            console.warn("No data available to export");
            return;
        }

        try {
            // Convert data to CSV
            const csvData = convertVpnServersToCSV(filteredVpnServers);

            // Create a Blob containing the CSV data with UTF-8 BOM for Excel compatibility
            // The \ufeff is a UTF-8 BOM (Byte Order Mark) that helps Excel recognize the CSV as UTF-8
            const blob = new Blob(["\ufeff" + csvData], {type: 'text/csv;charset=utf-8;'});

            // Create and set up the download link
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');

            // Set up the filename with date for better organization
            const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
            let filename = `vpn_servers`;

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

    // 3. Use effects
    useEffect(() => {
        fetchVpnServers();
    }, [fetchVpnServers]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-pulse">
                    <div
                        className="h-12 w-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <h3 className="ml-3 text-xl font-medium text-gray-700">Loading VPN Servers...</h3>
            </div>
        );
    }

    if (error) {
        return <LoadingTableErrorMessage
            message={error}
            onRetry={fetchVpnServers()}
        />;
    }

    // 4. Component rendering
    return (
        <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8 mt-8"> {/* Main container */}
            <div className="max-w-6xl mx-auto"> {/* Table width */}

                <div className="page-header mb-2">{/* Header section */}
                    <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">VPN Server Management System</h1>
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
                                label="Add New VPN Server"
                                onClick={toggleAddForm}
                            />
                        </div>
                    </div>
                </div>

                <div className="page-content mb-8">
                    <VpnServerTable
                        filteredVpnServers={filteredVpnServers}
                        isFiltering={isFiltering}
                        handleEdit={handleEdit}
                        handleDelete={handleDelete}
                        handleViewMachines={handleViewMachines}
                    />
                </div>

                {/* Modals */}
                <AddEditModal isOpen={showAddForm} onClose={toggleAddForm}>
                    <AddVpnServerForm
                        onVpnServerAdded={handleVpnServerAdded}
                        onVpnServerUpdated={handleVpnServerUpdated}
                        editVpnServer={editingVpnServer}
                        onCancel={toggleAddForm}
                    />
                </AddEditModal>

                <DeleteModal
                    isOpen={deleteConfirm !== null}
                    onDelete={confirmDelete}
                    onCancel={cancelDelete}
                    title="Delete VPN Server"
                    message="Are you sure you want to delete this server? This action cannot be undone."
                />
                
                <VpnAssignedMachineModal 
                    isOpen={showConnectedMachinesModal}
                    onClose={() => setShowConnectedMachinesModal(false)}
                    machines={selectedVpnServerMachines}
                    vpnServerName={selectedVpnServerName}
                />
            </div>
        </div>
    );
};

export default VpnServerList;