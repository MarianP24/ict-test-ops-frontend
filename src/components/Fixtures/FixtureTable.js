import React from 'react';

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
                                <button
                                    className="text-primary-600 hover:text-primary-900 mr-1 transition duration-150 ease-in-out"
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

                                <button
                                    onClick={() => handleAssignToMachine(fixture)}
                                    className="p-1 text-gray-600 hover:text-blue-600 focus:outline-none"
                                    title="Assign to Machine"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                                        />
                                    </svg>
                                </button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="8"
                            className="px-6 py-12 whitespace-nowrap text-center text-base text-gray-500">
                            <svg className="mx-auto h-12 w-12 text-gray-300" fill="none"
                                 stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1"
                                      d="M15.536 7.536a5 5 0 012.828 2.828m-2.828-2.828l-6.364 6.364m-3.536-3.536a5 5 0 002.828 2.828m-2.828-2.828L9 14"/>
                            </svg>
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