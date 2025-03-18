import React, { useState, useEffect } from 'react';
import FixtureService from '../services/FixtureService';

const AddFixtureForm = ({ onFixtureAdded, onFixtureUpdated, editFixture }) => {
    const initialFixtureState = {
        fileName: '',
        programName: '',
        productName: '',
        business: ''
    };

    const [fixture, setFixture] = useState(initialFixtureState);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    useEffect(() => {
        if (editFixture) {
            setFixture(editFixture);
            setIsEditMode(true);
        } else {
            setFixture(initialFixtureState);
            setIsEditMode(false);
        }
    }, [editFixture]);

    const handleInputChange = event => {
        const { name, value } = event.target;
        setFixture({ ...fixture, [name]: value });
    };

    const saveFixture = () => {
        // Validate form
        if (!fixture.fileName || !fixture.programName || !fixture.productName) {
            setError("Please fill in all required fields");
            return;
        }

        setIsSubmitting(true);

        const data = {
            fileName: fixture.fileName,
            programName: fixture.programName,
            productName: fixture.productName,
            business: fixture.business
        };

        if (isEditMode) {
            // Update existing fixture
            FixtureService.updateFixture(fixture.id, data)
                .then(response => {
                    setSubmitted(true);
                    setError(null);
                    if (onFixtureUpdated) {
                        onFixtureUpdated(response.data);
                    }
                    setTimeout(() => setSubmitted(false), 3000);
                })
                .catch(err => {
                    console.error("Error updating fixture:", err);
                    setError("Failed to update fixture. Please try again.");
                })
                .finally(() => {
                    setIsSubmitting(false);
                });
        } else {
            // Create new fixture
            FixtureService.createFixture(data)
                .then(response => {
                    setFixture(initialFixtureState);
                    setSubmitted(true);
                    setError(null);
                    if (onFixtureAdded) {
                        onFixtureAdded(response.data);
                    }
                    setTimeout(() => setSubmitted(false), 3000);
                })
                .catch(err => {
                    console.error("Error creating fixture:", err);
                    setError("Failed to create fixture. Please try again.");
                })
                .finally(() => {
                    setIsSubmitting(false);
                });
        }
    };

    const resetForm = () => {
        setFixture(initialFixtureState);
        setSubmitted(false);
        setError(null);
    };

    return (
        <div className="max-w-full">
            {submitted ? (
                <div className="rounded-md bg-green-50 p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-green-800">
                                {isEditMode ? 'Fixture updated successfully!' : 'Fixture added successfully!'}
                            </h3>
                        </div>
                    </div>
                </div>
            ) : (
                <form className="space-y-4">
                    {error && (
                        <div className="rounded-md bg-red-50 p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-red-800">{error}</h3>
                                </div>
                            </div>
                        </div>
                    )}

                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={fixture.name}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="serialNumber" className="block text-sm font-medium text-gray-700">
                            Serial Number <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="serialNumber"
                            name="serialNumber"
                            value={fixture.serialNumber}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                            Type <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="type"
                            name="type"
                            value={fixture.type}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                            Status
                        </label>
                        <select
                            id="status"
                            name="status"
                            value={fixture.status}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        >
                            <option value="AVAILABLE">AVAILABLE</option>
                            <option value="IN_USE">IN USE</option>
                            <option value="MAINTENANCE">MAINTENANCE</option>
                            <option value="BROKEN">BROKEN</option>
                        </select>
                    </div>

                    <div className="flex items-center justify-end space-x-3 pt-4">
                        {isEditMode && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none"
                            >
                                Reset
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={saveFixture}
                            disabled={isSubmitting}
                            className={`px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-700 focus:outline-none ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isSubmitting ? 'Processing...' : isEditMode ? 'Update' : 'Save'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default AddFixtureForm;