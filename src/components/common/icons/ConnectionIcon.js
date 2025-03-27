import React from 'react';

const ConnectionIcon = ({ className = "h-12 w-12 text-gray-300" }) => {
    return (
        <svg 
            className={className} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
        >
            <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="1"
                d="M15.536 7.536a5 5 0 012.828 2.828m-2.828-2.828l-6.364 6.364m-3.536-3.536a5 5 0 002.828 2.828m-2.828-2.828L9 14"
            />
        </svg>
    );
};

export default ConnectionIcon;