import { getEnv } from '@/helpers/getEnv';
import { useFetch } from '@/hooks/useFetch';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';

const getTimeAgo = (timestamp) => {
    const now = moment();
    const created = moment(timestamp);
    const minutes = now.diff(created, 'minutes');
    const hours = now.diff(created, 'hours');
    const days = now.diff(created, 'days');

    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hr ago`;
    return `${days} day${days > 1 ? 's' : ''} ago`;
};

const LikedByDropdown = ({ props: blogId }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null); // ref for the dropdown container

    const { data: AllLikeData, loading } = useFetch(
        `${getEnv('VITE_API_URL')}/api/like/get-like-by-blog/${blogId}`,
        { method: 'GET', credentials: 'include' },
        [blogId]
    );


    const likeData = AllLikeData?.like || [];

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    if (loading || likeData.length === 0) return null;
    console.log('likeData', likeData)

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-sm text-black underline hover:text-blue-600 transition cursor-pointer"
            >
                {/* Show full text on medium and above */}
                <span className="hidden md:inline">
                    Liked by {likeData[0]?.authorId?.name}
                    {likeData.length > 1 &&
                        ` and ${likeData.length - 1} other${likeData.length - 1 > 1 ? 's' : ''}`}
                </span>

                {/* Show short text (first 4 characters) on small screens */}
                <span className="inline md:hidden">
                    {`Liked by ${likeData[0]?.authorId?.name?.slice(0, 4)}${likeData.length > 1 ? '...' : ''
                        }`}
                </span>
            </button>

            {isOpen && (
                <div className="absolute mt-2 w-56 z-10 origin-top-right bg-white border border-gray-200 rounded-md shadow-lg">
                    <div className="py-2 px-4 max-h-60 overflow-y-auto ">
                        {likeData.map((like) => (
                            <div key={like._id} className="flex items-center gap-2 justify-between border-b-2">
                                <span className="text-sm">{like.authorId?.name}</span>
                                <span className="text-sm">{getTimeAgo(like.createdAt)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LikedByDropdown;
