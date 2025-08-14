import React from 'react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, isLoading }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 mb-4">{message}</p>
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                        disabled={isLoading}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Processing...' : 'Confirm'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;