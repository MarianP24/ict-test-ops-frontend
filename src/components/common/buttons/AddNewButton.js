import React from 'react';
import PlusIcon from '../icons/PlusIcon';

const AddNewButton = ({ onClick, label = "Add New" }) => {
    return (
        <button
            onClick={onClick}
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2"
        >
            <PlusIcon />
            {label}
        </button>
    );
};

export default AddNewButton;