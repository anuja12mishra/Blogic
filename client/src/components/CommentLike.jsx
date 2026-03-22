import React, { useState, useEffect } from 'react';
import { getEnv } from '@/helpers/getEnv';
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { useSelector } from 'react-redux';
import { showtoast } from '@/helpers/showtoast';

function CommentLike({ commentId, initialLikeCount, initialIsLiked }) {
    const user = useSelector((state) => state.user);
    const [likeCount, setLikeCount] = useState(initialLikeCount || 0);
    const [liked, setLiked] = useState(initialIsLiked || false);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        setLikeCount(initialLikeCount || 0);
        setLiked(initialIsLiked || false);
    }, [initialLikeCount, initialIsLiked]);

    const handleClick = async () => {
        if (isProcessing) return;
        if (!user?.isLoggedIn) {
            return showtoast('error', 'Please sign in to like comments');
        }

        setIsProcessing(true);

        try {
            const response = await fetch(`${getEnv('VITE_API_URL')}/api/comment/like/${commentId}`, {
                method: 'PUT',
                credentials: 'include',
            });

            const result = await response.json();

            if (response.ok) {
                setLikeCount(result.likeCount);
                setLiked(result.isLiked);
            } else {
                console.error('Failed to like/unlike comment');
                showtoast('error', result.message || 'Failed to update like status');
            }
        } catch (err) {
            console.error('Error in handleClick (CommentLike):', err);
            showtoast('error', 'An error occurred');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <button
            onClick={handleClick}
            disabled={isProcessing}
            className={`text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50 ${
                liked ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'
            }`}
        >
            {liked ? <FaHeart className="fill-current" size={14} /> : <FaRegHeart size={14} />}
            {likeCount > 0 && <span>{likeCount}</span>}
        </button>
    );
}

export default CommentLike;
