import React, {useState} from 'react';
import Pagination from '../common/Pagination';
import PropTypes from 'prop-types';
import {EditButton, DeleteButton} from '../common/sharedComponents';

const VpnServerTable = ({
                            filteredVpnServers,
                            isFiltering,
                            handleEdit,
                            handleDelete,
                            handleViewMachines
                        }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const totalItems = filteredVpnServers.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Calculate current page items
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredVpnServers.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className="space-y-4 w-full">
            <div className="w-full bg-white shadow-xl rounded-lg overflow-auto">
                <table className="divide-y divide-gray-200 w-full">
                    <thead>
                    <tr className="bg-gradient-to-r from-primary-600 to-primary-800">
                        <th scope="col"
                            className="px-2 py-3 text-center text-xs font-medium text-white uppercase tracking-wider rounded-tl-lg">
                            ID
                        </th>
                        <th scope="col"
                            className="px-2 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                            VPN Name
                        </th>
                        <th scope="col"
                            className="px-2 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                            Server Address
                        </th>
                        <th scope="col"
                            className="px-2 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                            Destination Network
                        </th>
                        <th scope="col"
                            className="px-2 py-3 text-center text-xs font-medium text-white uppercase tracking-wider rounded-tr-lg">
                            Actions
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {currentItems.length > 0 ? (
                        currentItems.map((vpnServer, index) => {
                            return (
                                <tr
                                    key={vpnServer.id}
                                    className="hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
                                    onClick={() => handleViewMachines(vpnServer)}
                                >
                                    <td className="py-2 text-sm text-center text-gray-700">{indexOfFirstItem + index + 1}</td>
                                    <td className="py-2 text-sm text-center text-gray-700">{vpnServer.vpnName}</td>
                                    <td className="py-2 text-sm text-center text-gray-700">{vpnServer.serverAddress}</td>
                                    <td className="py-2 text-sm text-center text-gray-700">{vpnServer.destinationNetwork}</td>
                                    <td className="py-2 text-center text-sm font-medium">

                                        <EditButton
                                            title="Edit VPN server"
                                            onClick={() => handleEdit(vpnServer)}
                                        />

                                        <DeleteButton
                                            title="Delete VPN server"
                                            onClick={() => handleDelete(vpnServer.id)}
                                        />
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <td colSpan="7"
                            className="px-6 py-12 whitespace-nowrap text-center text-base text-gray-500">
                            <p className="mt-2">No VPN servers found. Try adjusting your filters!</p>
                            {filteredVpnServers.length === 0 && !isFiltering && (
                                <p className="mt-1 text-sm">Add a new VPN server to get started</p>
                            )}
                        </td>
                    )}
                    </tbody>
                </table>
            </div>

            {totalItems > 10 ? (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                    itemName="VPN servers"
                />
            ) : (
                <div className="mt-4 text-center text-xs text-gray-500">
                    Showing {filteredVpnServers.length} VPN servers in total
                </div>
            )}
        </div>
    );
};

VpnServerTable.propTypes = {
    filteredVpnServers: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            vpnName: PropTypes.string.isRequired,
            serverAddress: PropTypes.string.isRequired,
            destinationNetwork: PropTypes.string.isRequired,
            machines: PropTypes.array
        })
    ).isRequired,
    isFiltering: PropTypes.bool.isRequired,
    handleEdit: PropTypes.func.isRequired,
    handleDelete: PropTypes.func.isRequired,
    handleViewMachines: PropTypes.func.isRequired
};

export default VpnServerTable;