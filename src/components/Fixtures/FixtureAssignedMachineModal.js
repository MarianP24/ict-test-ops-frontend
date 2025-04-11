import React from 'react';

const FixtureAssignedMachinesModal = ({ isOpen, onClose, machines, fixtureName, maxWidth = "sm:max-w-2xl" }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>

                {/* This element centers the modal contents. */}
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div className={`inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle ${maxWidth} sm:w-full`}>
                    <div className="absolute top-0 right-0 pt-4 pr-4 z-10">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                            <span className="sr-only">Close</span>
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                            Machines using Fixture: {fixtureName}
                        </h3>

                        {machines && machines.length > 0 ? (
                            <div className="max-h-60 overflow-y-auto">
                                <table className="min-w-full">
                                    <thead>
                                    <tr className="bg-gray-100">
                                        <th className="py-2 px-4 text-center">Equipment Name</th>
                                        <th className="py-2 px-4 text-center">Equipment Type</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {machines.map((machine, index) => (
                                        <tr key={machine.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                            <td className="py-2 px-4 text-center">{machine.equipmentName}</td>
                                            <td className="py-2 px-4 text-center">{machine.equipmentType || '-'}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500">
                                No machines are using this fixture.
                            </p>
                        )}

                        <div className="mt-5 sm:mt-6 text-right">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 bg-primary-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FixtureAssignedMachinesModal;