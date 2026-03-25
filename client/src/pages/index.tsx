import React from 'react';
import BlogCard from '@/components/BlogCard';
import Loading from '@/components/Loading';
import { getEnv } from '@/helpers/getEnv';
import { useFetch } from '@/hooks/useFetch';

interface Blog {
    _id: string;
    title: string;
    slug: string;
    featuredImage: string;
    updatedAt: string;
    category: {
        name: string;
        slug: string;
    };
    author: {
        name: string;
        username: string;
        avatar: string;
        role: string;
    };
}

interface BlogsData {
    blog: Blog[];
}

const Index: React.FC = () => {
  const { data: blogsData, loading: blogsLoading, error: blogsError } = useFetch<BlogsData>(
    `${getEnv('VITE_API_URL')}/api/blog/get-all-blogs`,
    { method: 'GET', credentials: 'include' },
  );

  if (blogsLoading && !blogsData) {
    return <Loading />;
  }

  if (blogsError) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-red-500 font-medium">Error loading blogs: {(blogsError as Error).message}</p>
        <button onClick={() => window.location.reload()} className="mt-4 text-purple-600 hover:underline">
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className='max-w-xl'>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
              Latest Stories
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Explore the latest insights, trends, and stories from our passionate community of writers.
            </p>
          </div>
        </div>

        {blogsData && blogsData.blog.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {blogsData.blog.map((blog) => (
              <BlogCard
                key={blog._id}
                props={{ blog }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-muted/30 rounded-3xl border border-dashed border-border">
            <h3 className="text-xl font-semibold opacity-50">No blogs found</h3>
            <p className="text-muted-foreground mt-2">Check back later for new content!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
