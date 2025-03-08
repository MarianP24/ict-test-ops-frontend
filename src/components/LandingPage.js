// src/components/LandingPage.js
import React from 'react';

const LandingPage = () => {
    return (
        <div className="landing-page">
            {/* Hero Section */}
            <div
                className="flex flex-col items-center justify-center pt-16 lg:pt-24 pb-12 min-h-[80vh] bg-gray-50 px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8 sm:mb-10">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary-800 mb-4 sm:mb-6">
                        Welcome to Test Ops Platform
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-600 max-w-xl sm:max-w-2xl mx-auto">
                        The command center for all your testing operations and resources
                    </p>
                </div>

                {/* FORVIA Image */}
                <div className="w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl px-4">
                    <img
                        src="/images/landing-page/FORVIA.png"
                        alt="FORVIA"
                        className="w-full h-auto object-contain shadow-2xl rounded-lg"
                    />
                </div>

                {/* Optional Call to Action Button */}
                <div className="mt-8 sm:mt-10">
                    <a
                        href="/machines"
                        className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 border border-transparent text-sm sm:text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                        Get Started
                    </a>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;