import Loading from '@/components/Loading';
import { getEnv } from '@/helpers/getEnv';
import { useFetch } from '@/hooks/useFetch';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { Badge } from '@/components/ui/badge';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import moment from 'moment';
import { decode } from 'entities'
import Comments from '@/components/Comments';
import { Share2 } from "lucide-react";
import CommentCount from '@/components/CommentCount';
import BlogLike from '@/components/BlogLike';
import RelatedBlog from '@/components/RelatedBlog';
import ViewsCount from '@/components/ViewsCount';
import LikedByDropdown from '@/components/LikedByDropdown';
import { showtoast } from '@/helpers/showtoast';
import BlogSkeleton from '@/pages/Blog/loading/BlogSkeleton';
function SingleBlogDetails() {
    const { blog_id } = useParams();
    const [shouldSkipViewIncrement, setShouldSkipViewIncrement] = useState(null);


    function handleShare(blog) {
        const blogUrl = window.location.href;
        const customMessage = `Check out this blog: ${blog.title}\n${blogUrl}`;
        try {
            if (navigator.share) {
                navigator
                    .share({
                        title: blog.title,
                        text: "Check out this blog!",
                        url: blogUrl,
                    }).then(() => {
                        showtoast('success', "Blog link copied to clipboard!");
                    })
                    .catch((err) => {
                        showtoast('error', "Share canceled");
                        console.log("Share canceled", err)
                    });
            } else {
                navigator.clipboard.writeText(customMessage)
                    .then(() => {
                        showtoast('success', "Blog link copied to clipboard!");
                    })
                    .catch(() => {
                        showtoast('error', "can't copy blog link");
                    });
            }
        } catch (error) {
            showtoast('error', "can't share the blog");
            console.log('error in share', error);
        }
    }

    useEffect(() => {
        const viewedBlogs = JSON.parse(sessionStorage.getItem('viewedBlogs') || '[]');
        const hasBeenViewed = viewedBlogs.includes(blog_id);
        setShouldSkipViewIncrement(hasBeenViewed);

        if (!hasBeenViewed) {
            viewedBlogs.push(blog_id);
            sessionStorage.setItem('viewedBlogs', JSON.stringify(viewedBlogs));
        }
    }, [blog_id]);

    // Custom fetch hook that conditionally increments views
    const { data: blogData, loading: blogLoading } = useFetch(
        shouldSkipViewIncrement !== null
            ? `${getEnv('VITE_API_URL')}/api/blog/get-a-blog/${blog_id}${shouldSkipViewIncrement ? '?skipViewIncrement=true' : ''}`
            : null,
        { method: 'GET', credentials: 'include' },
        [blog_id, shouldSkipViewIncrement]
    );

    if (shouldSkipViewIncrement === null || blogLoading || !blogData) {
        return <BlogSkeleton />
    }

    if (!blogData.blog) {
        return <div>Blog not found</div>
    }

    const blog = blogData.blog;

    return (
        <div className='max-w-7xl mx-auto px-4 py-8 select-none'>
            <div className='flex flex-col lg:flex-row gap-12'>
                {/* Main Content Area */}
                <article className='flex-1 space-y-8'>
                    {/* Category & Breadcrumb */}
                    <div className="flex items-center gap-2 mb-4">
                         <span className="text-xs font-bold uppercase tracking-widest text-purple-600">
                            {blog.category.name}
                        </span>
                    </div>

                    {/* Blog Title */}
                    <h1 className='text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-foreground'>
                        {blog.title}
                    </h1>

                    {/* Meta Info: Author & Stats */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-6 border-y border-border/50">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <img
                                    src={blog.author.avatar || '/default-avatar.png'}
                                    alt={blog.author.name}
                                    className="h-12 w-12 rounded-full object-cover border-2 border-background ring-2 ring-purple-100"
                                />
                                {blog.author.role === "admin" && (
                                    <div className="absolute -bottom-1 -right-1 bg-blue-500 text-[10px] font-bold text-white px-1.5 py-0.5 rounded-md border border-background">
                                        admin
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col">
                                <p className="font-semibold text-base text-foreground">{blog.author.name}</p>
                                <p className="text-xs text-muted-foreground">
                                    {moment(blog.createdAt).format('MMMM DD, YYYY')} • {Math.ceil(decode(blog.blogContent).split(' ').length / 200)} min read
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 text-muted-foreground">
                            <div className="flex items-center gap-6">
                                <BlogLike props={blogData.blog._id} />
                                <CommentCount props={blogData.blog._id} />
                                <ViewsCount props={blogData.blog.views} />
                            </div>
                            <button
                                onClick={() => handleShare(blog)}
                                className="p-2 hover:bg-secondary rounded-full transition-colors"
                                title="Share"
                            >
                                <Share2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Social Proof: Liked By */}
                    <div className="flex items-center gap-3 -mt-4 mb-2 px-2">
                        <LikedByDropdown props={blogData.blog._id} />
                    </div>

                    {/* Featured Image */}
                    {blog.featuredImage && (
                        <div className="relative aspect-video overflow-hidden rounded-2xl shadow-lg group">
                            <img
                                src={blog.featuredImage}
                                alt={blog.title}
                                className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                            />
                        </div>
                    )}

                    {/* Blog Content */}
                    
                    <div
                        className="blog-content prose prose-lg md:prose-xl max-w-none dark:prose-invert prose-headings:font-bold prose-p:leading-relaxed prose-img:rounded-xl"
                        dangerouslySetInnerHTML={{
                            __html: decode(blog.blogContent)
                        }}
                    />

                    {/* Discussion Section */}
                    <section className='mt-16 pt-12 border-t border-border/50'>
                        <Comments blogId={blogData.blog._id} authorId={blogData.blog.author._id} />
                    </section>
                </article>

                {/* Sidebar: Related Blogs */}
                <aside className='w-full lg:w-[320px] shrink-0'>
                    <div className="sticky top-28 space-y-8">
                        <div>
                            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-purple-600"></span>
                                Continue Reading
                            </h2>
                            <div className="space-y-6">
                                <RelatedBlog props={{ category: blogData.blog?.category?._id, currentBlogSlug: blogData.blog?.slug }} />
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    )
}

export default SingleBlogDetails;