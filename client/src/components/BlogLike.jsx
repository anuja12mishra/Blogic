import React, { useEffect, useState } from 'react';
import { getEnv } from '@/helpers/getEnv';
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { useSelector } from 'react-redux';
import { showtoast } from '@/helpers/showtoast';

function BlogLike({ props: blogId }) {
    const user = useSelector((state) => state.user);
    const [likeCount, setLikeCount] = useState(0);
    const [liked, setLiked] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const authorIdParam = user?.isLoggedIn && user?.user?._id ? user.user._id:null ;

    useEffect(() => {
        const fetchLikes = async () => {
            try {
                const res = await fetch(`${getEnv('VITE_API_URL')}/api/like/like-count/${blogId}/${authorIdParam}`, {
                    method: 'GET',
                    credentials: 'include',
                });
                const data = await res.json();
                if (data?.like !== undefined) {
                    setLikeCount(data.like);
                    setLiked(data.isLiked);
                }
            } catch (err) {
                console.error("Error fetching likes:", err);
            }
        };
        if (blogId) fetchLikes();
    }, [blogId, authorIdParam]);

    const handleClick = async () => {
        if (isProcessing) return;
        if (!user?.isLoggedIn) {
            return showtoast('error', 'Please login into your account.');
        }

        setIsProcessing(true);

        try {
            const response = await fetch(`${getEnv('VITE_API_URL')}/api/like/update-like`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    blogId,
                    authorId: user.user._id,
                    action: liked ? 'unlike' : 'like'
                })
            });

            const result = await response.json();

            if (response.ok) {
                setLikeCount(result.like);
                setLiked(result.isLiked);
            } else {
                console.error('Failed to like/unlike');
                showtoast('error', result.message || 'Failed to update like status');
            }
        } catch (err) {
            console.error('Error in handleClick:', err);
            showtoast('error', 'An error occurred');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div>
            <button
                onClick={handleClick}
                // disabled={isProcessing || !user?.isLoggedIn}
                className='flex items-center gap-1 hover:cursor-pointer disabled:opacity-50'
            >
                {liked ? <FaHeart className='text-red-600' /> : <FaRegHeart />}
                <p className='flex justify-center items-center'>{likeCount}</p>
            </button>
        </div>
    );
}

export default BlogLike;
