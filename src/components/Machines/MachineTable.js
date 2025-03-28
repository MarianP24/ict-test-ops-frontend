import React from 'react';
import {EditButton, DeleteButton, ConnectionIcon} from '../common/sharedComponents';


const MachineTable = ({
                          machines,
                          filteredMachines,
                          handleEdit,
                          handleDelete,
                          handleViewFixtures
                      }) => {
    return (
        <div className="inline-block min-w-full bg-white shadow-xl rounded-lg overflow-hidden">
            <table className="w-full divide-y divide-gray-200 table-auto">
                <thead>
                <tr className="bg-gradient-to-r from-primary-600 to-primary-800">
                    <th scope="col"
                        className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider rounded-tl-lg">
                        ID
                    </th>
                    <th scope="col"
                        className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                        Equipment Name
                    </th>
                    <th scope="col"
                        className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                        Internal Factory
                    </th>
                    <th scope="col"
                        className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                        Serial Number
                    </th>
                    <th scope="col"
                        className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                        Equipment Type
                    </th>
                    <th scope="col"
                        className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                        Hostname
                    </th>
                    <th scope="col"
                        className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider rounded-tr-lg">
                        Actions
                    </th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {machines.length > 0 ? (
                    filteredMachines.map((machine, index) => {
                        return (
                            <tr
                                key={machine.id}
                                className="hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
                                onClick={() => handleViewFixtures(machine)}
                            >
                                <td className="px-6 py-4 whitespace-nowrap text-center text-gray-700">{index + 1}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-center text-gray-700">{machine.equipmentName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-center text-gray-700">{machine.internalFactory}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-center text-gray-700">{machine.serialNumber}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-center text-gray-700">{machine.equipmentType}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-center text-gray-700">{machine.hostname}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">

                                    <EditButton
                                        title="Edit machine"
                                        onClick={() => handleEdit(machine)}
                                    />

                                    <DeleteButton
                                        title="Delete machine"
                                        onClick={() => handleDelete(machine.id)}
                                    />
                                </td>
                            </tr>
                        );
                    })
                ) : (
                    <tr>
                        <td colSpan="7" className="px-6 py-12 whitespace-nowrap text-center text-base text-gray-500">
                            <ConnectionIcon/>
                            <p className="mt-2">No machines found</p>
                            <p className="mt-1 text-sm">Add a new machine to get started</p>
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
};

export default MachineTable;