import React from 'react';

const PlusIcon = ({ className = "h-4 w-4 mr-1.5" }) => (
    <svg
        className={className}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 4v16m8-8H4"
        />
    </svg>
);

export default PlusIcon;