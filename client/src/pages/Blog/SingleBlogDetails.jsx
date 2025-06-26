import Loading from '@/components/Loading';
import { getEnv } from '@/helpers/getEnv';
import { useFetch } from '@/hooks/useFetch';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { Badge } from '@/components/ui/badge'; // Added missing import
import React from 'react'
import { useParams } from 'react-router-dom';
import moment from 'moment'; // Added for date formatting
import { decode } from 'entities'
import Comments from '@/components/Comments';
import { FaRegComment } from "react-icons/fa";
import CommentCount from '@/components/CommentCount';
import BlogLike from '@/components/BlogLike';
import RelatedBlog from '@/components/RelatedBlog';
function SingleBlogDetails() {
    const { blog_id } = useParams();

    const { data: blogData, loading: blogLoading } = useFetch(
        `${getEnv('VITE_API_URL')}/api/blog/get-a-blog/${blog_id}`,
        { method: 'GET', credentials: 'include' },
        [blog_id]
    );

    // console.log('blogData cat name',blogData?.blog?.category?.name)

    if (blogLoading) {
        return <Loading />
    }

    // Handle case when blogData is not available
    if (!blogData || !blogData.blog) {
        return <div>Blog not found</div>
    }

    const blog = blogData.blog;

    return (
        <div className='flex flex-col w-full md:flex-row justify-between gap-6 md:gap-16 p-4'>
            <div className='border-2 rounded w-full md:w-[70%] p-5'>
                {/* Blog Title */}
                <h1 className='text-3xl font-bold mb-4'>{blog.title}</h1>

                {/* Author and Admin Badge Section */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-center w-full gap-2 mb-2">
                    <div className="flex items-center justify-between gap-8">
                        <Avatar className="flex items-center gap-2">
                            <AvatarImage
                                src={blog.author.avatar || '/default-avatar.png'}
                                className="h-10 w-10 rounded-full object-cover"
                            />
                            <AvatarFallback className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                {blog.author.name?.charAt(0)?.toUpperCase() || 'A'}
                            </AvatarFallback>
                            <div className="flex flex-col">
                                <p className="font-medium text-sm">{blog.author.name}</p>
                                <p className="text-xs text-gray-500">
                                    {moment(blog.createdAt).format('MMM DD, YYYY')}
                                </p>
                            </div>
                        </Avatar>
                        <div className='flex gap-4 justify-end items-center'>
                            <BlogLike props={blogData.blog._id} />
                            <CommentCount props={blogData.blog._id} />
                        </div>
                    </div>

                    {/* Fixed the condition - removed props reference */}
                    {blog.author.role === "admin" && (
                        <div className="flex justify-start md:justify-center items-center hover:cursor-default">
                            <Badge
                                variant="secondary"
                                className="bg-blue-500 text-white dark:bg-blue-600 rounded-lg px-3 py-1"
                            >
                                Admin
                            </Badge>
                        </div>
                    )}
                </div>

                {/* Featured Image */}
                {/* {blog.featuredImage && (
                    <div className="mb-2 flex justify-center">
                        <div className="bg-gray-300 p-2 rounded-lg">
                            <img
                                src={blog.featuredImage}
                                alt={blog.title}
                                className="w-full h-64 object-contain rounded-lg bg-gray-100"
                            />
                        </div>
                    </div>
                )} */}
                {blog.featuredImage && (
                    <div className="mb-2">
                        <img
                            src={blog.featuredImage}
                            alt={blog.title}
                            className="w-full h-64 object-contain bg-gray-100 rounded-lg"
                        />
                    </div>
                )}

                {/* Category */}
                <div className="mb-2">
                    <Badge variant="outline" className="mb-4">
                        {blog.category.name}
                    </Badge>
                </div>

                {/* Blog Content */}
                <div
                    className="border-t-2 border-b-2 py-4 prose max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700"
                    dangerouslySetInnerHTML={{
                        __html: decode(blog.blogContent)
                    }}
                />
                <div className='mt-4 rounded w-full p-2'>
                    <Comments props={blogData.blog._id} />
                </div>

            </div>

            <div className='border-2 rounded w-full md:w-[30%] p-4 h-fit'>
                <h2 className="text-xl font-bold mb-4">Related Blogs</h2>
                {/* Related blog content will go here */}
                <RelatedBlog props={{ category: blogData.blog?.category?._id, currentBlogSlug: blogData.blog?.slug }} />
            </div>
        </div>
    )
}

export default SingleBlogDetails;


