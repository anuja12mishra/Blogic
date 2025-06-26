import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { FaRegComment } from "react-icons/fa";
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from './ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from './ui/textarea';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RouteSignIn } from '@/helpers/RouteName';
import { getEnv } from '@/helpers/getEnv';
import { showtoast } from '@/helpers/showtoast';
import { useFetch } from '@/hooks/useFetch';
import Loading from './Loading';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import moment from 'moment';

const formSchema = z.object({
    comment: z.string().min(1, 'Comment cannot be empty'),
});

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


function Comments(props) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [refresh, setRefresh] = useState(false);

    const user = useSelector((state) => state.user);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            comment: ''
        },
    });

    const { data: commentData, loading: commentLoading } = useFetch(
        `${getEnv('VITE_API_URL')}/api/comment/get-all-comment/${props.props}`,
        { method: 'GET', credentials: 'include' },
        [refresh] // Fixed: added missing comma before dependency array
    );

    // console.log('commentData', commentData);

    async function onSubmit(values) {
        if (isSubmitting) return;
        setIsSubmitting(true);
        const newValues = { ...values, blogId: props.props, authorId: user.user._id };

        try {
            const res = await fetch(`${getEnv('VITE_API_URL')}/api/comment/add`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newValues)
            });

            const data = await res.json();

            if (!res.ok) {
                const errorMessage = data.message || `Server error: ${res.status}`;
                showtoast('error', errorMessage);
                return;
            }

            // Success case
            const successMessage = data.message || 'Comment added successfully!';
            showtoast('success', successMessage);

            // Reset form after successful submission
            form.reset();

            // Trigger refresh to reload comments
            setRefresh((prev) => !prev);

        } catch (err) {
            console.error('Request failed:', err);
            showtoast('error', 'Network error: Unable to connect to server');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div>
            <h1 className='flex justify-left items-center gap-3 mb-2'>
                <p className='text-xl font-bold'>Comments</p>
                <FaRegComment size={20} className='text-purple-600' />
            </h1>
            {
                user && user.isLoggedIn ?
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="space-y-2">
                                <FormField
                                    control={form.control}
                                    name="comment"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Comment here"
                                                    disabled={isSubmitting}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="flex gap-1">
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Adding Comment...' : 'Add Comment'}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </Form>
                    :
                    <Link to={RouteSignIn}>
                        <Button>
                            Sign-In To Comment
                        </Button>
                    </Link>
            }

            {/* All comments */}
            <div className='px-2 mt-4'>
                {
                    commentLoading ?
                        <Loading />
                        :
                        commentData && commentData.comment && commentData.comment.length > 0 ?
                            <div>
                                <div className='flex gap-2 text-2xl mb-3 font-bold'>
                                    {commentData.comment.length}
                                    <h1>Comments</h1>
                                </div>
                                {commentData.comment.map((data) => {
                                    return (
                                        <div key={data._id} className="mb-6 p-4 bg-gray-200 rounded-xl border-b border-gray-200 last:border-b-0">
                                            <div className="flex items-start gap-3">
                                                <Avatar className="flex-shrink-0">
                                                    <AvatarImage
                                                        src={data.authorId?.avatar || '/default-avatar.png'}
                                                        alt={data.authorId?.name || 'User'}
                                                        className="h-10 w-10 rounded-full object-cover"
                                                    />
                                                    <AvatarFallback className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
                                                        {data.authorId?.name?.charAt(0)?.toUpperCase() || 'A'}
                                                    </AvatarFallback>
                                                </Avatar>

                                                <div className="flex flex-col w-full max-w-full overflow-x-auto">
                                                    <div className="flex justify-between items-center gap-1 mb-1">
                                                        <p className="font-medium text-sm text-gray-900">
                                                            {data.authorId?.name || 'Anonymous'}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {getTimeAgo(data.createdAt)}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-700 text-sm leading-relaxed break-words">
                                                            {data.comment}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    )
                                })}
                            </div>
                            :
                            <p className="text-gray-500 text-center py-8">No comments yet. Be the first to comment!</p>
                }
            </div>

        </div >
    )
}

export default Comments;