import React from 'react'
import Loading from './Loading';
import { useFetch } from '@/hooks/useFetch';
import { getEnv } from '@/helpers/getEnv';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { RouteSingleBlogDetails } from '@/helpers/RouteName';

function RelatedBlog({ props }) {
    const { data: relatedBlog, loading: ralatedBlogLoding } = useFetch(
        `${getEnv('VITE_API_URL')}/api/blog/get-blog-by-category/${props.category}/${props.currentBlogSlug}`,
        { method: 'GET', credentials: 'include' },
        [props.props]
    );
    if (ralatedBlogLoding) {
        return <Loading />
    }
    //console.log('relatedBlog',relatedBlog)
    return (
        <div>
            {
                relatedBlog && relatedBlog.blog.length > 0 ? (
                    relatedBlog.blog.map((data) => {
                        return (
                            <Link key={data._id} to={RouteSingleBlogDetails(props.category,data.slug,data._id)}>
                                <div className='flex items-center gap-2 m-2 bg-gray-200 w-full rounded-sm p-2'>
                                    <img className='w-16 h-16 object-cover rounded-sm' src={data.featuredImage} />
                                    <div className='flex-row justify-between items-center'>
                                        <h4 className='font-semibold line-clamp-1'>{data.title}</h4>
                                        <spam className='text-sm'>{moment(data.updatedAt).format('MMM DD, YYYY')}</spam>
                                    </div>
                                </div>
                            </Link>
                        )
                    })
                ) : (
                    <h1>There is no related blogs</h1>
                )
            }
        </div>
    )
}

export default RelatedBlog
