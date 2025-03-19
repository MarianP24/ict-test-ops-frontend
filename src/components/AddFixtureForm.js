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

                <div>
                    <h3 className="text-xl font-semibold leading-6 text-gray-900 mb-6 pb-2 border-b border-gray-200">
                        {isEditMode ? 'Edit Fixture' : 'Add New Fixture'}
                    </h3>

                    {error && (
                        <div className="rounded-md bg-red-50 p-4 mb-4">
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

                    <div className="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                            <label htmlFor="programName" className="block text-sm font-medium text-gray-700 mb-1">
                                Program Name<span className="text-red-500">*</span>
                            </label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    id="programName"
                                    name="programName"
                                    required
                                    value={fixture.programName}
                                    onChange={handleInputChange}
                                    placeholder="Enter program name"
                                    className="shadow-sm bg-gray-50 focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-0 border-b-2 border-gray-200 focus:border-primary-500 rounded-lg px-3 py-2.5 transition-all duration-200"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="fileName" className="block text-sm font-medium text-gray-700 mb-1">
                                File Name<span className="text-red-500">*</span>
                            </label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    id="fileName"
                                    name="fileName"
                                    required
                                    value={fixture.fileName}
                                    onChange={handleInputChange}
                                    placeholder="Enter file name"
                                    className="shadow-sm bg-gray-50 focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-0 border-b-2 border-gray-200 focus:border-primary-500 rounded-lg px-3 py-2.5 transition-all duration-200"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-1">
                                Product Name<span className="text-red-500">*</span>
                            </label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    id="productName"
                                    name="productName"
                                    required
                                    value={fixture.productName}
                                    onChange={handleInputChange}
                                    placeholder="Enter product name"
                                    className="shadow-sm bg-gray-50 focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-0 border-b-2 border-gray-200 focus:border-primary-500 rounded-lg px-3 py-2.5 transition-all duration-200"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="business" className="block text-sm font-medium text-gray-700 mb-1">
                                Business
                            </label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    id="business"
                                    name="business"
                                    value={fixture.business}
                                    onChange={handleInputChange}
                                    placeholder="Enter business"
                                    className="shadow-sm bg-gray-50 focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-0 border-b-2 border-gray-200 focus:border-primary-500 rounded-lg px-3 py-2.5 transition-all duration-200"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="counterSet" className="block text-sm font-medium text-gray-700 mb-1">
                                Counter Set
                            </label>
                            <div className="mt-1">
                                <input
                                    type="number"
                                    id="counterSet"
                                    name="counterSet"
                                    value={fixture.fixtureCounterSet}
                                    onChange={handleInputChange}
                                    placeholder="Enter counter set"
                                    className="shadow-sm bg-gray-50 focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-0 border-b-2 border-gray-200 focus:border-primary-500 rounded-lg px-3 py-2.5 transition-all duration-200"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-5">
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={resetForm}
                                className="bg-white py-2.5 px-5 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
                            >
                                Reset
                            </button>
                            <button
                                type="button"
                                onClick={saveFixture}
                                disabled={isSubmitting}
                                className={`ml-3 inline-flex justify-center py-2.5 px-5 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white 
                                    ${isSubmitting ? 'bg-primary-400' : 'bg-primary-600 hover:bg-primary-700'} 
                                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Saving...
                                    </>
                                ) : isEditMode ? 'Update Fixture' : 'Add Fixture'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddFixtureForm;