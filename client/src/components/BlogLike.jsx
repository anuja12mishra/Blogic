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


// import React, { useEffect, useState } from 'react';
// import { getEnv } from '@/helpers/getEnv';
// import { useFetch } from '@/hooks/useFetch';
// import { FaRegHeart, FaHeart } from "react-icons/fa";
// import { useSelector } from 'react-redux';
// import { showtoast } from '@/helpers/showtoast';

// function BlogLike(props) {
//     const user = useSelector((state) => state.user);
//     const blogId = props.props;
//     const [likeCount, setLikeCount] = useState(0);
//     const [liked, setLiked] = useState(false);
//     const [isProcessing, setIsProcessing] = useState(false);

//     // Only fetch if user is logged in and has valid ID
//     const shouldFetch = user?.isLoggedIn && user?.user?._id;
//     const authorIdParam = shouldFetch ? user.user._id : 'guest';
 
//     const { data: likeCountData, loading: linkLoading, refetch } = useFetch(
//         `${getEnv('VITE_API_URL')}/api/like/like-count/${blogId}/${authorIdParam}`,
//         { method: 'GET', credentials: 'include' }
//     );


//     useEffect(() => {
//         if (likeCountData?.like !== undefined) {
//             setLikeCount(likeCountData.like);
//             setLiked(likeCountData.isLiked);
//         }
//     }, [likeCountData]);

//     const handleClick = async () => {
//         if (isProcessing) return; // Prevent double clicks

//         try {
//             if (!user?.isLoggedIn) {
//                 return showtoast('error', 'Please login into your account.');
//             }

//             setIsProcessing(true);

//             const response = await fetch(`${getEnv('VITE_API_URL')}/api/like/update-like`, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 credentials: 'include',
//                 body: JSON.stringify({
//                     blogId,
//                     authorId: user.user._id,
//                     action: liked ? 'unlike' : 'like'
//                 }),

//             });

//             if (response.ok) {
//                 const result = await response.json();
//                 // Update state with server response
//                 setLikeCount(result.like);
//                 setLiked(result.isLiked);
//             } else {
//                 console.error('Failed to like/unlike');
//                 showtoast('error', 'Failed to update like status');
//                 // Optionally refetch to sync with server
//                 if (refetch) refetch();
//             }
//         } catch (err) {
//             console.error('Error in handleClick:', err);
//             showtoast('error', 'An error occurred');
//             // Optionally refetch to sync with server
//             if (refetch) refetch();
//         } finally {
//             setIsProcessing(false);
//         }
//     };

//     return (
//         <div>
//             {!linkLoading ? (
//                 <button
//                     key={blogId}
//                     onClick={handleClick}
//                     disabled={isProcessing || !user?.isLoggedIn}
//                     className='flex items-center gap-1 hover:cursor-pointer disabled:opacity-50'
//                 >
//                     {liked ? <FaHeart className='text-red-600' /> : <FaRegHeart />}
//                     <p className='flex justify-center items-center'>{likeCount}</p>
//                 </button>
//             ) : (
//                 <p>Loading...</p>
//             )}
//         </div>
//     );
// }

// export default BlogLike;

// import React, { useEffect, useState } from 'react';
// import { getEnv } from '@/helpers/getEnv';
// import { useFetch } from '@/hooks/useFetch';
// import { FaRegHeart, FaHeart } from "react-icons/fa";
// import { useSelector } from 'react-redux';
// import { showtoast } from '@/helpers/showtoast';


// function BlogLike(props) {
//     const user = useSelector((state) => state.user);
//     const blogId = props.props;

//     const { data: likeCountData, loading: linkLoading } = useFetch(
//         `${getEnv('VITE_API_URL')}/api/like/like-count/${blogId}?authorId=${user?.user?._id}`,
//         { method: 'GET', credentials: 'include' }
//     );

//     const [likeCount, setLikeCount] = useState(0);
//     const [liked, setLiked] = useState(false);

//     useEffect(() => {
//         if (likeCountData?.like !== undefined) {
//             setLikeCount(likeCountData.like);
//             setLiked(likeCountData.isLiked);
//         }
//     }, [likeCountData]);

//     const handleClick = async () => {
//         try {
//             if (!user?.isLoggedIn) {
//                 return showtoast('error', 'Please login into your account.');
//             }

//             const response = await fetch(`${getEnv('VITE_API_URL')}/api/like/update-like`, {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 credentials: 'include',
//                 body: JSON.stringify({
//                     blogId,
//                     authorId: user.user._id,
//                 }),
//             });

//             if (response.ok) {
//                 const result = await response.json();
//                 setLikeCount(result.like);
//                 setLiked(prev => !prev);
//             } else {
//                 console.error('Failed to like/unlike');
//             }
//         } catch (err) {
//             console.error('Error in handleClick:', err);
//         }
//     };

//     return (
//         <div>
//             {!linkLoading ? (
//                 <button onClick={handleClick} className='flex items-center gap-1 hover:cursor-pointer'>
//                     {liked ? <FaHeart className='text-red-600' /> : <FaRegHeart />}
//                     <p className='flex justify-center items-center'>{likeCount}</p>
//                 </button>
//             ) : (
//                 <p>Loading...</p>
//             )}
//         </div>
//     );
// }

// export default BlogLike;
