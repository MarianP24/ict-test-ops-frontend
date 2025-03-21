import React from 'react';

const FixturesModal = ({ isOpen, onClose, fixtures, machineName }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" onClick={onClose}>
            <div
                className="relative top-20 mx-auto p-5 border w-auto max-w-2xl shadow-lg rounded-md bg-white"
                onClick={e => e.stopPropagation()}
            >
                <div className="mt-3 text-center">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Fixtures for Machine: {machineName}
                    </h3>
                    <div className="mt-2 px-7 py-3">
                        {fixtures && fixtures.length > 0 ? (
                            <div className="max-h-60 overflow-y-auto">
                                <table className="min-w-full">
                                    <thead>
                                    <tr className="bg-gray-100">
                                        <th className="py-2 px-4 text-left">ID</th>
                                        <th className="py-2 px-4 text-left">Name</th>
                                        <th className="py-2 px-4 text-left">Serial Number</th>
                                        {/* Add more columns based on your Fixture entity properties */}
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {fixtures.map((fixture, index) => (
                                        <tr key={fixture.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                            <td className="py-2 px-4">{fixture.id}</td>
                                            <td className="py-2 px-4">{fixture.name || '-'}</td>
                                            <td className="py-2 px-4">{fixture.serialNumber || '-'}</td>
                                            {/* Add more cells based on your Fixture entity properties */}
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500">
                                No fixtures assigned to this machine.
                            </p>
                        )}
                    </div>
                    <div className="items-center px-4 py-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-primary-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FixturesModal;