import React from 'react';
import Loading from './Loading';
import { useFetch } from '@/hooks/useFetch';
import { getEnv } from '@/helpers/getEnv';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { RouteSingleBlogDetails } from '@/helpers/RouteName';

interface Blog {
    _id: string;
    title: string;
    slug: string;
    featuredImage: string;
    updatedAt: string;
}

interface RelatedBlogData {
    blog: Blog[];
}

interface RelatedBlogProps {
    category: string | undefined;
    currentBlogSlug: string | undefined;
}

const RelatedBlog: React.FC<RelatedBlogProps> = ({ category, currentBlogSlug }) => {
    const { data: relatedBlog, loading: relatedBlogLoading } = useFetch<RelatedBlogData>(
        `${getEnv('VITE_API_URL')}/api/blog/get-blog-by-category/${category}/${currentBlogSlug}`,
        { method: 'GET', credentials: 'include' },
        [category, currentBlogSlug]
    );

    if (relatedBlogLoading) {
        return <Loading />;
    }

    return (
        <div>
            {relatedBlog && relatedBlog.blog.length > 0 ? (
                relatedBlog.blog.map((data) => {
                    return (
                        <Link key={data._id} to={RouteSingleBlogDetails(category || "", data.slug, data._id)}>
                            <div className='flex items-center gap-2 m-2 bg-muted w-full rounded-sm p-2'>
                                <img className='w-16 h-16 object-cover rounded-sm' src={data.featuredImage} alt={data.title} />
                                <div className='flex-row justify-between items-center'>
                                    <h4 className='font-semibold line-clamp-1'>{data.title}</h4>
                                    <span className='text-sm'>{moment(data.updatedAt).format('MMM DD, YYYY')}</span>
                                </div>
                            </div>
                        </Link>
                    );
                })
            ) : (
                <h1 className='text-center text-muted-foreground '>There is no related blogs</h1>
            )}
        </div>
    );
};

export default RelatedBlog;
