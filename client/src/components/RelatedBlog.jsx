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



//{
//     "success": true,
//     "message": "Related Blogs fetched successfully",
//     "blog": [
//         {
//             "_id": "6852aa02ea886efead1aaeb2",
//             "author": "6849a2f55acf922667e9fee4",
//             "category": "685295a0ea886efead1aad8e",
//             "title": "dj all night rust all day {{{{}}}}((((_)))))",
//             "slug": "dj-all-night-rust-all-day",
//             "blogContent": "&lt;p&gt;asoedujgf;HWEBFHVBWQEW;FIBWE&lt;/p&gt;",
//             "featuredImage": "https://pub-9f09e6b4408f404cb8578e1043c90ce6.r2.dev/featuredImage/ab684566-8442-4c01-86e2-f408d564c691.png",
//             "featuredImageKey": "featuredImage/ab684566-8442-4c01-86e2-f408d564c691.png",
//             "createdAt": "2025-06-18T11:58:58.530Z",
//             "updatedAt": "2025-06-18T11:58:58.530Z",
//             "__v": 0
//         },
//         {
//             "_id": "6855642f7d48b51b401ed96f",
//             "author": "684c32ba265f922656f0ab9d",
//             "category": "685295a0ea886efead1aad8e",
//             "title": "rrrrrrrrrr",
//             "slug": "rrrrrrrrrr",
//             "blogContent": "&lt;p&gt;ddddd&lt;/p&gt;",
//             "featuredImage": "https://pub-9f09e6b4408f404cb8578e1043c90ce6.r2.dev/featuredImage/15271fac-79fe-452e-820a-86bb2aae5369.png",
//             "featuredImageKey": "featuredImage/15271fac-79fe-452e-820a-86bb2aae5369.png",
//             "createdAt": "2025-06-20T13:37:51.671Z",
//             "updatedAt": "2025-06-20T13:37:51.671Z",
//             "__v": 0
//         }
//     ]
// }