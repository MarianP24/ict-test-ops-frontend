import React from 'react';
import PropTypes from 'prop-types';

const Pagination = ({
                        currentPage,
                        totalPages,
                        totalItems,
                        itemsPerPage,
                        onPageChange,
                        itemName = 'items'
                    }) => {
    const indexOfFirstItem = (currentPage - 1) * itemsPerPage + 1;
    const indexOfLastItem = Math.min(currentPage * itemsPerPage, totalItems);

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    return (
        <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-3 px-4 py-3 bg-white rounded-lg shadow-xl border border-gray-100 max-w-screen-lg mx-auto">
            <div className="flex items-center">
            <span className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-xs font-medium">
              {totalItems} {itemName}
            </span>

                <span className="hidden md:inline-flex items-center ml-4 text-sm text-gray-600">
              Showing <span className="font-medium mx-1">{indexOfFirstItem}-{indexOfLastItem}</span> of <span className="font-medium ml-1">{totalItems}</span>
            </span>
            </div>

            {totalPages > 1 && (
                <div className="flex items-center">
                    <div className="flex border border-gray-200 rounded-md overflow-hidden shadow-sm">
                        <button
                            onClick={goToPreviousPage}
                            disabled={currentPage === 1}
                            className={`flex items-center justify-center h-8 w-8 ${
                                currentPage === 1
                                    ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                                    : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-primary-600'
                            } transition-colors duration-200 border-r border-gray-200`}
                            aria-label="Previous page"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </button>

                        <div className="hidden sm:flex">
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                let pageToShow;
                                if (totalPages <= 5) {
                                    pageToShow = i + 1;
                                } else {
                                    const startPage = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
                                    pageToShow = startPage + i;
                                }

                                return (
                                    <button
                                        key={pageToShow}
                                        onClick={() => onPageChange(pageToShow)}
                                        className={`flex items-center justify-center h-8 w-8 text-sm font-medium transition-colors duration-200 ${
                                            currentPage === pageToShow
                                                ? 'bg-primary-50 text-primary-700'
                                                : 'bg-white text-gray-700 hover:bg-gray-50'
                                        } ${i < 4 ? 'border-r border-gray-200' : ''}`}
                                    >
                                        {pageToShow}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="sm:hidden flex items-center justify-center h-8 px-3 bg-white text-sm font-medium text-gray-600 border-r border-gray-200">
                            {currentPage} / {totalPages}
                        </div>

                        <button
                            onClick={goToNextPage}
                            disabled={currentPage === totalPages}
                            className={`flex items-center justify-center h-8 w-8 ${
                                currentPage === totalPages
                                    ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                                    : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-primary-600'
                            } transition-colors duration-200`}
                            aria-label="Next page"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

Pagination.propTypes = {
    currentPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    totalItems: PropTypes.number.isRequired,
    itemsPerPage: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    itemName: PropTypes.string
};

export default Pagination;