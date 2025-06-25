// Index.tsx
import BlogCard from '@/components/BlogCard';
import Loading from '@/components/Loading';
import { getEnv } from '@/helpers/getEnv';
import { useFetch } from '@/hooks/useFetch';
import React from 'react'
import { TbCategory } from 'react-icons/tb';
import { MdOutlineHome } from "react-icons/md";
function Index() {
  const { data: blogsData, loading, error } = useFetch(
    `${getEnv('VITE_API_URL')}/api/blog/get-all-blogs`,
    { method: 'GET', credentials: 'include' },
  );

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <p>Error loading blogs: {error.message}</p>;
  }

  // const blogs = blogsData?.blog || [];
  // console.log('blogs',blogs);

  return (
    <div className="w-full">
      <div className='flex justify-start items-center gap-2 text-purple-600  p-2 border-b-2 border-gray-300' >
        <MdOutlineHome size={30} />
        <h4 className='text-2xl font-bold'>Home</h4>
      </div>
      {/* Container with proper padding and max-width */}
      <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {blogsData && blogsData.blog.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {blogsData.blog.map((blog) => (
              <BlogCard
                key={blog._id}
                props={{ blog }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No blogs found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Index;