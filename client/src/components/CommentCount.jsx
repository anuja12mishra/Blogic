import { getEnv } from '@/helpers/getEnv';
import { useFetch } from '@/hooks/useFetch';
import React from 'react'
import { FaRegComment } from "react-icons/fa";
function CommentCount(props) {
    // console.log('props', props.props)
    const { data: commentData, loading: commentLoading } = useFetch(
        `${getEnv('VITE_API_URL')}/api/comment/comment-count/${props.props}`,
        { method: 'GET', credentials: 'include' },
    );
    // console.log('commentData', commentData)
    return (
        <div >
            {
                commentData ?
                    <div className='flex items-center gap-1'>
                        <FaRegComment />
                        <p  className='flex justify-center items-center'>{commentData.comment}</p>
                    </div>

                    : <p>Loading...</p>
            }

        </div>
    )
}

export default CommentCount