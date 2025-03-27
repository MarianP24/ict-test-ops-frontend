import React from 'react';
import { DeleteIcon } from '../sharedComponents';

const DeleteButton = ({
                          title,
                          onClick,
                          className = "text-red-600 hover:text-red-900 transition duration-150 ease-in-out"
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
            <DeleteIcon />
        </button>
    );
};

export default DeleteButton;