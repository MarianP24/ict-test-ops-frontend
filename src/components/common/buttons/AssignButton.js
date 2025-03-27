import React from 'react';
import { AttachmentIcon } from '../sharedComponents';

const AssignButton = ({
                          title,
                          onClick,
                          className = "p-1 text-gray-600 hover:text-blue-600 focus:outline-none"
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
            <AttachmentIcon />
        </button>
    );
};

export default AssignButton;