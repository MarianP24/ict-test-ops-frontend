import React, { useState, useRef, useEffect } from 'react';

const TableFilterBar = ({ filters, setFilters, applyFilters, columns }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [activeFilterCount, setActiveFilterCount] = useState(0);
    const [tempFilters, setTempFilters] = useState({...filters});

    const handleFilterChange = (column, value) => {
        setTempFilters(prev => ({
            ...prev,
            [column]: value
        }));
    };

    const handleApplyFilters = () => {
        setFilters(tempFilters);
        if (applyFilters) {
            applyFilters(tempFilters);
        }
        setIsOpen(false);
    };

    const clearFilters = () => {
        const emptyFilters = Object.keys(filters).reduce((acc, key) => {
            acc[key] = '';
            return acc;
        }, {});
        setFilters(emptyFilters);
        setTempFilters(emptyFilters);
        if (applyFilters) {
            applyFilters(emptyFilters);
        }
    };

    useEffect(() => {
        if (isOpen) {
            setTempFilters({...filters});
        }
    }, [isOpen, filters]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
                // Reset temp filters if closed without applying
                setTempFilters({...filters});
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef, filters]);

    useEffect(() => {
        const count = Object.values(filters).filter(value => value && value.trim() !== '').length;
        setActiveFilterCount(count);
    }, [filters]);

    return (
        <div className="mb-4 relative" ref={dropdownRef}>
            <div className="flex items-center">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`px-4 py-2 rounded-md flex items-center gap-2 transition-colors ${
                        activeFilterCount > 0
                            ? 'bg-primary-100 text-primary-700 hover:bg-primary-200'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Filters</span>
                    {activeFilterCount > 0 && (
                        <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-primary-100 bg-primary-700 rounded-full">
                            {activeFilterCount}
                        </span>
                    )}
                </button>

                {activeFilterCount > 0 && (
                    <button
                        onClick={clearFilters}
                        className="ml-3 text-sm text-gray-600 hover:text-gray-900 underline"
                    >
                        Clear all
                    </button>
                )}
            </div>

            <div
                className={`absolute mt-2 left-0 right-0 bg-white p-4 rounded-lg shadow-lg border border-gray-200 z-10 transition-all duration-200 ease-out transform ${
                    isOpen
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 -translate-y-4 pointer-events-none'
                }`}
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {columns.map(column => (
                        <div key={column.key} className="flex flex-col">
                            <label className="text-xs font-medium text-gray-700 mb-1 flex justify-between">
                                <span>{column.label}</span>
                                {tempFilters[column.key] && (
                                    <button
                                        onClick={() => handleFilterChange(column.key, '')}
                                        className="text-gray-400 hover:text-gray-600"
                                        aria-label={`Clear ${column.label} filter`}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </label>
                            <input
                                type="text"
                                className={`px-3 py-2 border rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm ${
                                    tempFilters[column.key] ? 'border-primary-500 bg-primary-50' : 'border-gray-300'
                                }`}
                                placeholder=""
                                value={tempFilters[column.key] || ''}
                                onChange={(e) => handleFilterChange(column.key, e.target.value)}
                            />
                        </div>
                    ))}
                </div>

                <div className="flex justify-end mt-4">
                    <button
                        onClick={handleApplyFilters}
                        className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md transition-colors"
                    >
                        Apply Filters
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TableFilterBar;