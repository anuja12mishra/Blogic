import { getEnv } from '@/helpers/getEnv';
import { useFetch } from '@/hooks/useFetch';
import React from 'react';
import { FaRegComment } from "react-icons/fa";

interface CommentCountProps {
    props: string; // The blog ID
}

const CommentCount: React.FC<CommentCountProps> = ({ props }) => {
    const { data: commentData } = useFetch<{ comment: number }>(
        `${getEnv('VITE_API_URL')}/api/comment/comment-count/${props}`,
        { method: 'GET', credentials: 'include' },
    );

    return (
        <div>
            {commentData ? (
                <div className='flex items-center gap-1'>
                    <FaRegComment />
                    <p className='flex justify-center items-center'>{commentData.comment}</p>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default CommentCount;