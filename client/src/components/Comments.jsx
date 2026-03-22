import React, { useState, useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from './ui/button';
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
import { 
    MessageSquare, 
    Reply, 
    Edit2, 
    Trash2, 
    X, 
    Send, 
    Smile, 
    ListFilter,
    Check
} from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import CommentLike from './CommentLike';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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

const CommentItem = ({ 
    data, 
    user, 
    authorId,
    onReply, 
    onEdit, 
    onDelete, 
    isEditing, 
    editValue, 
    setEditValue, 
    handleEditSubmit, 
    cancelEdit 
}) => {
    const isAuthor = data.authorId?._id === authorId;
    const hasLiked = data.likes?.includes(user?.user?._id);

    return (
        <div className="flex gap-4 group">
            <Avatar className="flex-shrink-0 mt-1 h-9 w-9">
                <AvatarImage
                    src={data.authorId?.avatar || '/default-avatar.png'}
                    alt={data.authorId?.name || 'User'}
                    className="rounded-full object-cover ring-2 ring-border/50"
                />
                <AvatarFallback className="rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary h-full w-full">
                    {data.authorId?.name?.charAt(0)?.toUpperCase() || 'A'}
                </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-1.5 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm tracking-tight text-foreground/90">
                        {data.authorId?.name || 'Anonymous'}
                    </span>
                    {isAuthor && (
                        <span className="bg-primary/10 text-primary text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-tighter">
                            Author
                        </span>
                    )}
                    <span className="text-[11px] font-medium text-muted-foreground tracking-wider">
                        • {getTimeAgo(data.createdAt)}
                    </span>
                </div>

                <div className="relative">
                    {isEditing ? (
                        <div className="space-y-3 mt-2 bg-muted/30 p-3 rounded-lg border border-border/50">
                            <Textarea 
                                value={editValue} 
                                onChange={(e) => setEditValue(e.target.value)}
                                className="min-h-[80px] border-none focus-visible:ring-0 bg-transparent p-0 resize-none text-sm"
                                autoFocus
                            />
                            <div className="flex justify-end gap-2">
                                <Button size="sm" variant="ghost" className="h-8 text-xs" onClick={cancelEdit}>
                                    Cancel
                                </Button>
                                <Button size="sm" onClick={handleEditSubmit} className="h-8 text-xs bg-purple-600 hover:bg-purple-700">
                                    Update
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm leading-relaxed text-foreground/80 break-words whitespace-pre-wrap">
                            {data.comment}
                        </p>
                    )}
                </div>

                {!isEditing && (
                    <div className="flex items-center gap-4 pt-1">
                        <CommentLike 
                            commentId={data._id}
                            initialLikeCount={data.likeCount}
                            initialIsLiked={hasLiked}
                        />
                        {onReply && (
                            <button 
                                onClick={onReply}
                                className="text-xs font-semibold text-muted-foreground hover:text-purple-600 flex items-center gap-1.5 transition-colors"
                            >
                                <MessageSquare size={14} /> Reply
                            </button>
                        )}
                        {user && user.isLoggedIn && user.user._id === data.authorId?._id && (
                            <div className="flex items-center gap-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                    onClick={onEdit}
                                    className="text-xs font-semibold text-muted-foreground hover:text-blue-600 flex items-center gap-1.5 transition-colors"
                                >
                                    <Edit2 size={13} /> Edit
                                </button>
                                <button 
                                    onClick={onDelete}
                                    className="text-xs font-semibold text-muted-foreground hover:text-red-600 flex items-center gap-1.5 transition-colors"
                                >
                                    <Trash2 size={13} /> Delete
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

function Comments({ blogId, authorId }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [replyingTo, setReplyingTo] = useState(null);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editValue, setEditValue] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [sortBy, setSortBy] = useState('newest'); // 'newest', 'oldest', 'popular'
    const emojiPickerRef = useRef(null);

    const user = useSelector((state) => state.user);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            comment: ''
        },
    });

    const { data: commentData, loading: commentLoading } = useFetch(
        `${getEnv('VITE_API_URL')}/api/comment/get-all-comment/${blogId}`,
        { method: 'GET', credentials: 'include' },
        [refresh]
    );

    useEffect(() => {
        function handleClickOutside(event) {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
                setShowEmojiPicker(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [emojiPickerRef]);

    async function onSubmit(values) {
        if (!user.isLoggedIn) {
            showtoast('error', 'Please sign in to comment');
            return;
        }
        if (isSubmitting) return;
        setIsSubmitting(true);
        const newValues = { 
            ...values, 
            blogId: blogId, 
            authorId: user.user._id,
            parentId: replyingTo 
        };

        try {
            const res = await fetch(`${getEnv('VITE_API_URL')}/api/comment/add`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newValues)
            });

            const data = await res.json();

            if (!res.ok) {
                showtoast('error', data.message || 'Server error');
                return;
            }

            showtoast('success', data.message || 'Comment added!');
            form.reset();
            setReplyingTo(null);
            setShowEmojiPicker(false);
            setRefresh((prev) => !prev);

        } catch (err) {
            showtoast('error', 'Network error');
        } finally {
            setIsSubmitting(false);
        }
    }


    const handleEdit = async (commentId) => {
        if (!editValue.trim()) return;
        try {
            const res = await fetch(`${getEnv('VITE_API_URL')}/api/comment/update/${commentId}`, {
                method: 'PUT',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ comment: editValue })
            });
            if (res.ok) {
                showtoast('success', 'Comment updated');
                setEditingCommentId(null);
                setRefresh(prev => !prev);
            }
        } catch (err) {
            showtoast('error', 'Error updating comment');
        }
    };

    const handleDelete = async (commentId) => {
        if (!window.confirm('Delete this comment?')) return;
        try {
            const res = await fetch(`${getEnv('VITE_API_URL')}/api/comment/delete/${commentId}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (res.ok) {
                showtoast('success', 'Comment deleted');
                setRefresh(prev => !prev);
            }
        } catch (err) {
            showtoast('error', 'Error deleting comment');
        }
    };

    const onEmojiClick = (emojiData) => {
        const currentComment = form.getValues('comment');
        form.setValue('comment', currentComment + emojiData.emoji);
    };

    const nestComments = (comments) => {
        if (!comments) return [];
        const map = {};
        const roots = [];
        comments.forEach(c => {
            map[c._id] = { ...c, replies: [] };
        });
        comments.forEach(c => {
            if (c.parentId) {
                if (map[c.parentId]) {
                    map[c.parentId].replies.push(map[c._id]);
                }
            } else {
                roots.push(map[c._id]);
            }
        });

        // Apply sorting to roots
        if (sortBy === 'newest') roots.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
        if (sortBy === 'oldest') roots.sort((a,b) => new Date(a.createdAt) - new Date(b.createdAt));
        if (sortBy === 'popular') roots.sort((a,b) => (b.likeCount || 0) - (a.likeCount || 0));

        return roots;
    };

    const nestedComments = nestComments(commentData?.comment);

    return (
        <div className="bg-card/50 p-6 rounded-3xl border border-border/50 shadow-sm">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    Discussion 
                    <span className="text-primary text-lg font-medium">({commentData?.comment?.length || 0})</span>
                </h2>
                
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl">
                            <ListFilter size={20} className="text-muted-foreground" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40 rounded-xl">
                        {[
                            { id: 'newest', label: 'Newest' },
                            { id: 'oldest', label: 'Oldest' },
                            { id: 'popular', label: 'Most Liked' }
                        ].map(opt => (
                            <DropdownMenuItem 
                                key={opt.id}
                                onClick={() => setSortBy(opt.id)}
                                className="flex items-center justify-between cursor-pointer"
                            >
                                {opt.label}
                                {sortBy === opt.id && <Check size={14} className="text-primary" />}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Post/Add Comment */}
            {user && user.isLoggedIn ? (
                <div className="bg-muted/30 p-4 rounded-3xl border border-border/40 mb-10 transition-all focus-within:ring-2 ring-primary/20">
                    <div className="flex gap-4">
                        <Avatar className="h-10 w-10 shrink-0">
                            <AvatarImage src={user.user?.avatar} className="rounded-full object-cover" />
                            <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold h-full w-full flex items-center justify-center">
                                {user.user?.name?.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="comment"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Share your thoughts with the community..."
                                                        disabled={isSubmitting}
                                                        className="min-h-[120px] bg-transparent border-none focus-visible:ring-0 p-2 shadow-none resize-none text-base leading-relaxed placeholder:text-muted-foreground/60"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="flex items-center justify-between pt-2 border-t border-border/40">
                                        <div className="relative" ref={emojiPickerRef}>
                                            <Button 
                                                type="button" 
                                                variant="ghost" 
                                                size="icon" 
                                                className="h-10 w-10 text-muted-foreground hover:text-primary rounded-xl"
                                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                            >
                                                <Smile size={20} />
                                            </Button>
                                            {showEmojiPicker && (
                                                <div className="absolute bottom-12 left-0 z-50 shadow-2xl rounded-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                                    <EmojiPicker 
                                                        onEmojiClick={onEmojiClick}
                                                        theme="dark"
                                                        width={300}
                                                        height={400}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="px-8 rounded-full bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-500/20 font-bold tracking-tight h-11"
                                        >
                                            {isSubmitting ? 'Posting...' : 'Post Comment'}
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="p-10 bg-muted/20 rounded-3xl border border-dashed border-border/60 text-center mb-10">
                    <p className="text-muted-foreground mb-4 font-medium">Join the community to share your thoughts</p>
                    <Link to={RouteSignIn}>
                        <Button className="rounded-full px-10 h-11 bg-primary hover:bg-primary/90">
                            Sign-In to Participate
                        </Button>
                    </Link>
                </div>
            )}

            {/* Comments List */}
            <div className='space-y-8'>
                {commentLoading ? (
                    <Loading />
                ) : nestedComments.length > 0 ? (
                    nestedComments.map((data) => (
                        <div key={data._id}>
                            <CommentItem 
                                data={data} 
                                user={user} 
                                authorId={authorId}
                                 onReply={() => setReplyingTo(data._id)}
                                onEdit={() => {
                                    setEditingCommentId(data._id);
                                    setEditValue(data.comment);
                                }}
                                onDelete={() => handleDelete(data._id)}
                                isEditing={editingCommentId === data._id}
                                editValue={editValue}
                                setEditValue={setEditValue}
                                handleEditSubmit={() => handleEdit(data._id)}
                                cancelEdit={() => setEditingCommentId(null)}
                            />

                            {/* Replies and Reply Form */}
                            {(data.replies?.length > 0 || replyingTo === data._id) && (
                                <div className="ml-5 pl-7 border-l-2 border-border/30 mt-4 space-y-6">
                                    {data.replies.map((reply) => (
                                        <div key={reply._id}>
                                            <CommentItem 
                                                data={reply} 
                                                user={user}
                                                authorId={authorId}
                                                onEdit={() => {
                                                    setEditingCommentId(reply._id);
                                                    setEditValue(reply.comment);
                                                }}
                                                onDelete={() => handleDelete(reply._id)}
                                                isEditing={editingCommentId === reply._id}
                                                editValue={editValue}
                                                setEditValue={setEditValue}
                                                handleEditSubmit={() => handleEdit(reply._id)}
                                                cancelEdit={() => setEditingCommentId(null)}
                                            />
                                        </div>
                                    ))}

                                    {replyingTo === data._id && (
                                        <div className="pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                            <div className="bg-muted/20 p-4 rounded-3xl border border-border/40">
                                                <Form {...form}>
                                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                                                        <FormField
                                                            control={form.control}
                                                            name="comment"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormControl>
                                                                        <Textarea 
                                                                            placeholder={`Replying to ${data.authorId?.name}...`} 
                                                                            {...field} 
                                                                            className="min-h-[80px] bg-transparent border-none focus-visible:ring-0 p-2 shadow-none resize-none text-sm"
                                                                            autoFocus
                                                                        />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                        <div className="flex justify-end gap-2">
                                                            <Button size="sm" variant="ghost" className="rounded-full text-xs" onClick={() => setReplyingTo(null)}>
                                                                Cancel
                                                            </Button>
                                                            <Button size="sm" type="submit" disabled={isSubmitting} className="rounded-full text-xs bg-purple-600 hover:bg-purple-700">
                                                                Post Reply
                                                            </Button>
                                                        </div>
                                                    </form>
                                                </Form>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 bg-muted/5 rounded-3xl border border-dashed border-border/50">
                        <MessageSquare className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                        <p className="text-muted-foreground font-medium">No thoughts shared yet. Be the first!</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Comments;