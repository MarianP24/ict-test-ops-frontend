import React, {useState} from 'react';
import Pagination from '../common/Pagination';
import PropTypes from 'prop-types';
import {EditButton, DeleteButton, AssignButton} from '../common/sharedComponents';


const MachineTable = ({
                          filteredMachines,
                          isFiltering,
                          handleEdit,
                          handleDelete,
                          handleViewFixtures,
                          handleAssignVpnServer
                      }) => {

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // Or whatever number you prefer

    const totalItems = filteredMachines.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Calculate current page items
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredMachines.slice(indexOfFirstItem, indexOfLastItem);


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
                            Equipment Name
                        </th>
                        <th scope="col"
                            className="px-2 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                            Internal Factory
                        </th>
                        <th scope="col"
                            className="px-2 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                            Serial Number
                        </th>
                        <th scope="col"
                            className="px-2 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                            Equipment Type
                        </th>
                        <th scope="col"
                            className="px-2 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                            Hostname
                        </th>
                        <th scope="col"
                            className="px-2 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                            Username
                        </th>
                        <th scope="col"
                            className="px-2 py-3 text-center text-xs font-medium text-white uppercase tracking-wider rounded-tr-lg">
                            Actions
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {currentItems.length > 0 ? (
                        currentItems.map((machine, index) => {
                            return (
                                <tr
                                    key={machine.id}
                                    className="hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
                                    onClick={() => handleViewFixtures(machine)}
                                >
                                    <td className="py-2 text-sm text-center text-gray-700">{indexOfFirstItem + index + 1}</td>
                                    <td className="py-2 text-sm text-center text-gray-700">{machine.equipmentName}</td>
                                    <td className="py-2 text-sm text-center text-gray-700">{machine.internalFactory}</td>
                                    <td className="py-2 text-sm text-center text-gray-700">{machine.serialNumber}</td>
                                    <td className="py-2 text-sm text-center text-gray-700">{machine.equipmentType}</td>
                                    <td className="py-2 text-sm text-center text-gray-700">{machine.hostname}</td>
                                    <td className="py-2 text-sm text-center text-gray-700">{machine.machineUsername}</td>
                                    <td className="py-2 text-center text-sm font-medium">

                                        <EditButton
                                            title="Edit machine"
                                            onClick={() => handleEdit(machine)}
                                        />

                                        <DeleteButton
                                            title="Delete machine"
                                            onClick={() => handleDelete(machine.id)}
                                        />

                                        <AssignButton
                                            title="Assign VPN Server"
                                            onClick={() => handleAssignVpnServer(machine)}
                                        />
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan="7"
                                className="px-6 py-12 whitespace-nowrap text-center text-base text-gray-500">
                                <p className="mt-2">No machines found. Try adjusting your filters!</p>
                                {filteredMachines.length === 0 && !isFiltering && (
                                    <p className="mt-1 text-sm">Add a new machine to get started</p>
                                )}
                            </td>
                        </tr>
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
                    itemName="machines"
                />
            ) : (
                <div className="mt-4 text-center text-xs text-gray-500">
                    Showing {filteredMachines.length} machines in total
                </div>
            )}
        </div>
    );
};

MachineTable.propTypes = {
    filteredMachines: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            equipmentName: PropTypes.string.isRequired,
            internalFactory: PropTypes.string.isRequired,
            serialNumber: PropTypes.string.isRequired,
            equipmentType: PropTypes.string.isRequired,
            hostname: PropTypes.string.isRequired,
            machineUsername: PropTypes.string.isRequired
        })
    ).isRequired,
    isFiltering: PropTypes.bool.isRequired,
    handleEdit: PropTypes.func.isRequired,
    handleDelete: PropTypes.func.isRequired,
    handleViewFixtures: PropTypes.func.isRequired,
    handleAssignVpnServer: PropTypes.func.isRequired
};

export default MachineTable;