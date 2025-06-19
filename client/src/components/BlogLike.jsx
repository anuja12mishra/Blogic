import React, { useEffect, useState } from 'react';
import { getEnv } from '@/helpers/getEnv';
import { useFetch } from '@/hooks/useFetch';
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { useSelector } from 'react-redux';
import { showtoast } from '@/helpers/showtoast';

function BlogLike(props) {
    const user = useSelector((state) => state.user);
    const blogId = props.props;

    const { data: likeCountData, loading: linkLoading } = useFetch(
        `${getEnv('VITE_API_URL')}/api/like/like-count/${blogId}?authorId=${user?.user?._id}`,
        { method: 'GET', credentials: 'include' }
    );

    const [likeCount, setLikeCount] = useState(0);
    const [liked, setLiked] = useState(false);

    useEffect(() => {
        if (likeCountData?.like !== undefined) {
            setLikeCount(likeCountData.like);
            setLiked(likeCountData.isLiked);
        }
    }, [likeCountData]);

    const handleClick = async () => {
        try {
            if (!user?.isLoggedIn) {
                return showtoast('error', 'Please login into your account.');
            }

            const response = await fetch(`${getEnv('VITE_API_URL')}/api/like/update-like`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    blogId,
                    authorId: user.user._id,
                }),
            });

            if (response.ok) {
                const result = await response.json();
                setLikeCount(result.like);
                setLiked(prev => !prev);
            } else {
                console.error('Failed to like/unlike');
            }
        } catch (err) {
            console.error('Error in handleClick:', err);
        }
    };

    return (
        <div>
            {!linkLoading ? (
                <button onClick={handleClick} className='flex items-center gap-1 hover:cursor-pointer'>
                    {liked ? <FaHeart className='text-red-600' /> : <FaRegHeart />}
                    <p className='flex justify-center items-center'>{likeCount}</p>
                </button>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default BlogLike;
