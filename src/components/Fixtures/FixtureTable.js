import React from 'react';
import {EditButton, DeleteButton, AssignButton, ConnectionIcon } from '../common/sharedComponents';

const FixtureTable = ({
                          fixtures,
                          filteredFixtures,
                          sortField,
                          sortDirection,
                          handleSort,
                          handleEdit,
                          handleDelete,
                          handleAssignToMachine
                      }) => {
    return (
        <div className="overflow-x-auto shadow-xl rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
                <thead>
                <tr className="bg-gradient-to-r from-primary-600 to-primary-800">
                    <th scope="col"
                        className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider rounded-tl-lg cursor-pointer hover:bg-primary-700"
                        onClick={() => handleSort('id')}>
                        ID
                        {sortField === 'id' && (
                            <span className="ml-1">
                  {sortDirection === 'asc' ? '↑' : '↓'}
                </span>
                        )}
                    </th>
                    <th scope="col"
                        className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                        Program Name
                    </th>
                    <th scope="col"
                        className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                        File Name
                    </th>
                    <th scope="col"
                        className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                        Product Name
                    </th>
                    <th scope="col"
                        className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                        Business
                    </th>
                    <th scope="col"
                        className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                        Counter Set
                    </th>
                    <th scope="col"
                        className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider cursor-pointer hover:bg-primary-700"
                        onClick={() => handleSort('counter')}>
                        Counter
                        {sortField === 'counter' && (
                            <span className="ml-1">
                  {sortDirection === 'asc' ? '↑' : '↓'}
                </span>
                        )}
                    </th>
                    <th scope="col"
                        className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider rounded-tr-lg">
                        Actions
                    </th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {fixtures.length > 0 ? (
                    filteredFixtures.map((fixture) => (
                        <tr
                            key={fixture.id}
                            className="hover:bg-gray-100 transition-colors duration-200"
                        >
                            <td className="px-6 py-4 whitespace-nowrap text-center font-medium text-gray-900">{fixture.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-center text-gray-700">{fixture.programName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-center text-gray-700">{fixture.fileName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-center text-gray-700">{fixture.productName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-center text-gray-700">{fixture.business}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-center text-gray-700">{fixture.fixtureCounterSet}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-center text-gray-700">{fixture.counter}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">

                                <EditButton
                                    title="Edit fixture"
                                    onClick={() => handleEdit(fixture)}
                                />

                                <DeleteButton
                                    title="Delete fixture"
                                    onClick={() => handleDelete(fixture.id)}
                                />

                                <AssignButton
                                    title="Assign to Machine"
                                    onClick={() => handleAssignToMachine(fixture)}
                                />
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="8"
                            className="px-6 py-12 whitespace-nowrap text-center text-base text-gray-500">
                            <ConnectionIcon />
                            <p className="mt-2">No fixtures found</p>
                            <p className="mt-1 text-sm">Add a new fixture to get started</p>
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
};

export default FixtureTable;