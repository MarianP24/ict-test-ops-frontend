import React from 'react';
import PropTypes from 'prop-types';

const DownloadButton = ({
                            onClick,
                            filename = 'download',
                            label = 'Download',
                            disabled = false,
                            className = '',
                            iconClassName = 'h-4 w-4 mr-1.5'
                        }) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`inline-flex items-center justify-center px-3 py-1.5 border border-transparent 
                      text-xs font-medium rounded-md shadow-sm text-white bg-primary-600 
                      hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
                      focus:ring-primary-500 transition-colors duration-200 disabled:opacity-50 
                      disabled:cursor-not-allowed ${className}`}
            title={`Download ${filename}`}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className={iconClassName}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
            </svg>
            {label}
        </button>
    );
};

DownloadButton.propTypes = {
    onClick: PropTypes.func.isRequired,
    filename: PropTypes.string,
    label: PropTypes.string,
    disabled: PropTypes.bool,
    className: PropTypes.string,
    iconClassName: PropTypes.string
};

export default DownloadButton;