import React from 'react';
import { EditIcon } from '../sharedComponents';

const EditButton = ({
                        title,
                        onClick,
                        className = "text-primary-600 hover:text-primary-900 mr-1 transition duration-150 ease-in-out"
                    }) => {
    return (
        <button
            className={className}
            title={title}
            onClick={(e) => {
                e.stopPropagation(); // Prevent row click event
                onClick(e);
            }}
        >
            <EditIcon />
        </button>
    );
};

export default EditButton;