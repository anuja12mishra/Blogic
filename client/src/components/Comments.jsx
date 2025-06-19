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

const formSchema = z.object({
    comment: z.string().min(1, 'Comment cannot be empty'),
});

function Comments(props) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const user = useSelector((state) => state.user);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            comment: ''
        },
    });

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

        } catch (err) {
            console.error('Request failed:', err);
            // showtoast('error', 'Network error: Unable to connect to server');
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
                                    name="comment" // Fixed: was "name", should be "comment"
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
            <div className='px-4 mt-4'>
                <p>Comments will be displayed here</p>
            </div>

        </div >
    )
}

export default Comments;