import React, {useState} from 'react';
import Pagination from '../common/Pagination';
import PropTypes from 'prop-types';
import {EditButton, DeleteButton, AssignButton} from '../common/sharedComponents';

const FixtureTable = ({
                          filteredFixtures,
                          isFiltering,
                          sortField,
                          sortDirection,
                          handleSort,
                          handleEdit,
                          handleDelete,
                          handleAssignToMachine,
                          handleViewMachines
                      }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // Or whatever number you prefer

    const totalItems = filteredFixtures.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Calculate current page items
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredFixtures.slice(indexOfFirstItem, indexOfLastItem);


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
                            Program Name
                        </th>
                        <th scope="col"
                            className="px-2 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                            File Name
                        </th>
                        <th scope="col"
                            className="px-2 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                            Product Name
                        </th>
                        <th scope="col"
                            className="px-2 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                            Business
                        </th>
                        <th scope="col"
                            className="px-2 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                            Counter Set
                        </th>
                        <th scope="col"
                            className="px-2 py-3 text-center text-xs font-medium text-white uppercase tracking-wider cursor-pointer hover:bg-primary-700"
                            onClick={() => handleSort('counter')}>
                            Counter
                            {sortField === 'counter' && (
                                <span className="ml-1">
                  {sortDirection === 'asc' ? '↑' : '↓'}
                </span>
                            )}
                        </th>
                        <th scope="col"
                            className="px-2 py-3 text-center text-xs font-medium text-white uppercase tracking-wider rounded-tr-lg">
                            Actions
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {currentItems.length > 0 ? (
                        currentItems.map((fixture, index) => (
                            <tr
                                key={fixture.id}
                                className="hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
                                onClick={() => handleViewMachines(fixture)}
                            >
                            <td className="py-2 text-sm text-center text-gray-700">{indexOfFirstItem + index + 1}</td>
                                <td className="py-2 text-sm text-center text-gray-700">{fixture.programName}</td>
                                <td className="py-2 text-sm text-center text-gray-700">{fixture.fileName}</td>
                                <td className="py-2 text-sm text-center text-gray-700">{fixture.productName}</td>
                                <td className="py-2 text-sm text-center text-gray-700">{fixture.business}</td>
                                <td className="py-2 text-sm text-center text-gray-700">{fixture.fixtureCounterSet}</td>
                                <td className="py-2 text-sm text-center text-gray-700">{fixture.counter}</td>
                                <td className="py-2 text-center text-sm font-medium">

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
                                <p className="mt-2">No fixtures found. Try adjusting your filters!</p>
                                {filteredFixtures.length === 0 && !isFiltering && (
                                    <p className="mt-1 text-sm">Add a new fixture to get started</p>
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
                    itemName="fixtures"
                />
            ) : (
                <div className="mt-4 text-center text-xs text-gray-500">
                    Showing {filteredFixtures.length} fixtures in total
                </div>
            )}
        </div>
    );
};

FixtureTable.propTypes = {

    filteredFixtures: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            programName: PropTypes.string,
            fileName: PropTypes.string,
            productName: PropTypes.string,
            business: PropTypes.string,
            fixtureCounterSet: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            counter: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        })
    ).isRequired,

    isFiltering: PropTypes.bool,

    // Sorting props
    sortField: PropTypes.string,
    sortDirection: PropTypes.oneOf(['asc', 'desc']),

    // Handler functions
    handleSort: PropTypes.func.isRequired,
    handleEdit: PropTypes.func.isRequired,
    handleDelete: PropTypes.func.isRequired,
    handleAssignToMachine: PropTypes.func.isRequired,
    handleViewMachines: PropTypes.func.isRequired
};

FixtureTable.defaultProps = {
    sortField: '',
    sortDirection: 'asc',
};

export default FixtureTable;