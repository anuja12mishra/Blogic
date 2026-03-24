import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useFetch } from '@/hooks/useFetch';
import { getEnv } from '@/helpers/getEnv';
import Loading from '@/components/Loading';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { Badge } from '@/components/ui/badge';
import BlogCard from '@/components/BlogCard';
import { FaUserAlt, FaExternalLinkAlt } from 'react-icons/fa';

const UserProfile = () => {
    const { username } = useParams();
    const { data, loading, error } = useFetch(
        `${getEnv('VITE_API_URL')}/api/user/public-details/${username}`,
        { method: 'GET', credentials: 'include' },
        [username]
    );

    if (loading) return <div className="min-h-screen flex items-center justify-center"><Loading /></div>;
    if (error || !data?.success) return <div className="min-h-screen flex items-center justify-center text-red-500">User not found</div>;

    const { user, blogs } = data;

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            {/* Header / Profile Info */}
            <div className="bg-card border border-border/50 rounded-3xl p-8 mb-12 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-purple-600/20 to-blue-600/20" />
                
                <div className="relative flex flex-col md:flex-row items-center md:items-end gap-6 mt-8">
                    <div className="relative group">
                        <Avatar className="h-32 w-32 md:h-40 md:w-40 ring-4 ring-background shadow-xl">
                            <AvatarImage 
                                src={user.avatar} 
                                alt={user.name} 
                                referrerPolicy="no-referrer"
                                className="rounded-full object-cover"
                            />
                            <AvatarFallback className="rounded-full bg-primary/10 flex items-center justify-center text-4xl font-bold text-primary h-full w-full">
                                {user.name?.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        {user.role === 'admin' && (
                            <Badge className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white font-bold border-2 border-background shadow-lg">
                                ADMIN
                            </Badge>
                        )}
                    </div>

                    <div className="flex-1 text-center md:text-left space-y-2">
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                            {user.name}
                        </h1>
                        <p className="text-muted-foreground font-medium flex items-center justify-center md:justify-start gap-2">
                            @{user.username}
                        </p>
                        {user.bio && (
                            <p className="text-foreground/80 max-w-2xl text-lg leading-relaxed mt-4">
                                {user.bio}
                            </p>
                        )}
                    </div>

                    <div className="flex gap-4 self-center md:self-end">
                        <div className="text-center px-6 py-2 bg-muted/30 rounded-2xl border border-border/50">
                            <p className="text-2xl font-bold">{blogs?.length || 0}</p>
                            <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Blogs</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Blogs Section */}
            <div>
                <div className="flex items-center gap-4 mb-8">
                    <h2 className="text-2xl font-bold">Published Blogs</h2>
                    <div className="h-px flex-1 bg-border/50" />
                </div>

                {blogs && blogs.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogs.map((blog) => (
                            <BlogCard key={blog._id} props={{ blog: { ...blog, author: user } }} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-muted/10 rounded-3xl border border-dashed border-border/60">
                        <FaUserAlt className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                        <p className="text-muted-foreground font-medium text-lg">No blogs published yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfile;
