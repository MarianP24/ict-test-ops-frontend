import React from 'react';
import { PlusIcon } from '../sharedComponents';

const AddNewButton = ({
                          label,
                          onClick,
                          className = "border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 px-4 py-2"
                      }) => {
    return (
        <button
            className={`inline-flex items-center ${className}`}
            onClick={(e) => {
                e.stopPropagation(); // Prevent row click event
                onClick(e);
            }}
        >
            <PlusIcon />
            {label}
        </button>
    );
};

export default AddNewButton;