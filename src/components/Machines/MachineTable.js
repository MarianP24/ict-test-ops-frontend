import React from 'react';

const MachineTable = ({
                          machines,
                          filteredMachines,
                          handleEdit,
                          handleDelete
                      }) => {
    return (
        <div className="inline-block min-w-full bg-white shadow-xl rounded-lg overflow-hidden">
            <table className="w-full divide-y divide-gray-200 table-auto">
                <thead>
                <tr className="bg-gradient-to-r from-primary-600 to-primary-800">
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider rounded-tl-lg">
                        ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Equipment Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Internal Factory
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Serial Number
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Equipment Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Hostname
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider rounded-tr-lg">
                        Actions
                    </th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {machines.length > 0 ? (
                    filteredMachines.map((machine) => {
                        return (
                            <tr
                                key={machine.id}
                                className={`hover:bg-gray-50 transition-colors duration-200`}
                            >
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 relative">
                                    {machine.id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{machine.equipmentName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{machine.internalFactory}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{machine.serialNumber}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{machine.equipmentType}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{machine.hostname}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        className="text-primary-600 hover:text-primary-900 mr-4 transition duration-150 ease-in-out"
                                        title="Edit machine"
                                        onClick={() => handleEdit(machine)}
                                    >
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                        </svg>
                                    </button>
                                    <button
                                        className="text-red-600 hover:text-red-900 transition duration-150 ease-in-out"
                                        title="Delete machine"
                                        onClick={() => handleDelete(machine.id)}
                                    >
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        );
                    })
                ) : (
                    <tr>
                        <td colSpan="7" className="px-6 py-12 whitespace-nowrap text-center text-base text-gray-500">
                            <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1"
                                      d="M15.536 7.536a5 5 0 012.828 2.828m-2.828-2.828l-6.364 6.364m-3.536-3.536a5 5 0 002.828 2.828m-2.828-2.828L9 14"/>
                            </svg>
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