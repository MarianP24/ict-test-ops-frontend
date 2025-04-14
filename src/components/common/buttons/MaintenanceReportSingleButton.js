import React from 'react';
import PropTypes from 'prop-types';

const MaintenanceIcon = ({ className = "h-5 w-5" }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
            />
        </svg>
    );
};

const MaintenanceReportSingleButton = ({
                                           fixtureId,
                                           onClick,
                                           disabled = false,
                                           title = "Generate maintenance report for this fixture",
                                           className = "p-1 text-gray-600 hover:text-green-600 focus:outline-none transition-colors duration-200"
                                       }) => {
    const handleClick = (e) => {
        e.stopPropagation(); // Prevent row click event
        onClick(fixtureId);
    };

    return (
        <button
            className={`${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            title={title}
            onClick={handleClick}
            disabled={disabled}
            aria-label="Generate maintenance report"
        >
            <MaintenanceIcon />
        </button>
    );
};

MaintenanceReportSingleButton.propTypes = {
    fixtureId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    onClick: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    title: PropTypes.string,
    className: PropTypes.string
};

export default MaintenanceReportSingleButton;