import React from 'react';
import './Loading.css';

const Loading: React.FC = () => {
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
            <p className="mt-8 text-gray-600 text-xl">Loading...</p>
        </div>
    );
};

export default Loading;
