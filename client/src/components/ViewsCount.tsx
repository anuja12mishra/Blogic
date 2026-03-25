import React from 'react';
import { FaRegEye } from "react-icons/fa";

interface ViewsCountProps {
    props: number | string;
}

const ViewsCount: React.FC<ViewsCountProps> = ({ props }) => {
    return (
        <div>
            {props ? (
                <div className='flex items-center gap-1'>
                    <FaRegEye />
                    <p className='flex justify-center items-center'>{props}</p>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default ViewsCount;