import React from 'react';
import './Loading.css';

function Loading() {
    return (
        <div className="w-full h-screen flex flex-col justify-center items-center">
            <div className="spinner">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
            <p className="mt-4 text-gray-600 text-sm">Loading...</p>
        </div>
    );
}

export default Loading;
