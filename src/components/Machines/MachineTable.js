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
                            className="px-2 py-3 text-center text-xs font-medium text-white uppercase tracking-wider rounded-tr-lg">
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
                                    <td className="text-sm text-center text-gray-700">{index + 1}</td>
                                    <td className="py-2 text-sm text-center text-gray-700">{machine.equipmentName}</td>
                                    <td className="py-2 text-sm text-center text-gray-700">{machine.internalFactory}</td>
                                    <td className="py-2 text-sm text-center text-gray-700">{machine.serialNumber}</td>
                                    <td className="py-2 text-sm text-center text-gray-700">{machine.equipmentType}</td>
                                    <td className="py-2 text-sm text-center text-gray-700">{machine.hostname}</td>
                                    <td className="py-2 whitespace-nowrap text-center text-sm font-medium">

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
                            <td colSpan="7"
                                className="px-6 py-12 whitespace-nowrap text-center text-base text-gray-500">
                                <ConnectionIcon/>
                                <p className="mt-2">No machines found</p>
                                <p className="mt-1 text-sm">Add a new machine to get started</p>
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MachineTable;