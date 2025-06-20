// import React from 'react'
// import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
// import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
// import logo from '../assets/logo.png'
// import { Badge } from "@/components/ui/badge"
// import { useSelector } from 'react-redux';
// import { FaRegCalendarAlt } from "react-icons/fa";
// import moment from 'moment';

// function BlogCard({
//     key,
//     title,
//     author,
//     createdAt,
//     image,
//     avatar
// }) {
//     const user = useSelector((state) => state.user);

//     return (
//         <Card className='w-full h-full flex flex-col hover:shadow-xl transition-shadow duration-300'>
//             <CardHeader className='flex-1'>
//                 {/* Author and Badge Section */}
//                 <div className='flex justify-between items-start w-full mb-3'>
//                     <div className="flex items-center gap-2 min-w-0 flex-1">
//                         <Avatar className="flex-shrink-0">
//                             <AvatarImage src={avatar} className='flex justify-center items-centerh-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover' />
//                             <AvatarFallback className='h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gray-200 flex items-center justify-center text-xs sm:text-sm'>
//                                 {author?.charAt(0).toUpperCase()}
//                             </AvatarFallback>
//                         </Avatar>
//                         <p className='text-sm sm:text-base font-medium text-gray-700 truncate'>
//                             {author}
//                         </p>
//                     </div>

//                     {user && user.user.role === 'admin' && (
//                         <div className='flex-shrink-0 ml-2'>
//                             <Badge variant="secondary" className='bg-blue-500 text-white dark:bg-blue-600 text-xs px-2 py-1'>
//                                 Admin
//                             </Badge>
//                         </div>
//                     )}
//                 </div>

//                 {/* Title */}
//                 <CardTitle className='text-lg sm:text-xl font-bold leading-tight sm:min-h-[3.5rem] overflow-hidden'>
//                     <span className='line-clamp-1'>
//                         {title}
//                     </span>
//                 </CardTitle>

//                 {/* Date */}
//                 <div className='flex items-center gap-2 mb-4'>
//                     <FaRegCalendarAlt className='text-gray-500 flex-shrink-0' size={12} />
//                     <span className='text-xs sm:text-sm text-gray-600'>
//                         {moment(createdAt).format('MMM DD, YYYY')}
//                     </span>
//                 </div>

//                 {/* Image */}
//                 <div className='w-full aspect-video bg-gray-100 rounded-lg overflow-hidden'>
//                     {image ? (
//                         <img
//                             src={image}
//                             alt={title}
//                             className='w-full h-full object-cover hover:scale-105 transition-transform duration-300'
//                             loading="lazy"
//                         />
//                     ) : (
//                         <div className='w-full h-full flex items-center justify-center bg-gray-200'>
//                             <svg
//                                 className="w-12 h-12 text-gray-400"
//                                 fill="none"
//                                 stroke="currentColor"
//                                 viewBox="0 0 24 24"
//                             >
//                                 <path
//                                     strokeLinecap="round"
//                                     strokeLinejoin="round"
//                                     strokeWidth={2}
//                                     d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
//                                 />
//                             </svg>
//                         </div>
//                     )}
//                 </div>
//             </CardHeader>

//             {/* Optional: Add CardContent for additional content like excerpt or read more button */}
//             <CardContent className='pt-0'>
//                 <button className='w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'>
//                     Read More
//                 </button>
//             </CardContent>
//         </Card>
//     )
// }

// export default BlogCard;

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import logo from '../assets/logo.png'
import { Badge } from "@/components/ui/badge"
import { useSelector } from 'react-redux';
import { FaRegCalendarAlt } from "react-icons/fa";
import moment from 'moment';
import { Link } from 'react-router-dom';
import { RouteSingleBlogDetails } from '@/helpers/RouteName';
function BlogCard({
    props
}) {
    const user = useSelector((state) => state.user);
    // console.log('props',props)

    return (
        <Link to={RouteSingleBlogDetails(props.blog.category.slug,props.blog.slug,props.blog._id)}>
            <Card className="h-full">
                <CardHeader className="h-full flex flex-col">
                    <div className="flex flex-col max-md:flex-row justify-between w-full gap-2 mb-2">
                        <div className="flex items-center gap-1.5">
                            <Avatar className="flex items-center gap-1">
                                <AvatarImage src={props.blog.author.avatar} className="h-10 w-10 rounded-full object-cover" />
                                <p className="truncate">{props.blog.author.name}</p>
                                <AvatarFallback />
                            </Avatar>
                        </div>

                        {props.blog.author && props.blog.author.role === "admin" ? (
                            <div className="flex justify-start max-md:justify-center items-center hover:cursor-default">
                                <Badge
                                    variant="secondary"
                                    className="bg-blue-500 text-white dark:bg-blue-600 rounded-lg px-3 py-1"
                                >
                                    Admin
                                </Badge>
                            </div>
                        ): <div className="flex justify-start max-md:justify-center items-center hover:cursor-default">
                                <Badge
                                    variant="secondary"
                                    className="bg-blue-500 text-white dark:bg-blue-600 rounded-lg px-3 py-1 "
                                >
                                    User
                                </Badge>
                            </div>
                        }
                    </div>

                    {/* Fixed height image container */}
                    <div className="w-full h-32 flex justify-center items-center mb-2">
                        <Avatar asChild className="w-full h-full">
                            <AvatarImage
                                src={props.blog.featuredImage}
                                className="rounded-md object-cover hover:scale-105 transition-transform duration-300"
                            />
                        </Avatar>
                    </div>

                    {/* Content that takes remaining space */}
                    <div className="mt-auto">
                        <CardTitle className="text-xl font-bold line-clamp-1 mb-2">
                            {props.blog.title}
                        </CardTitle>
                        <p className="flex justify-left items-center gap-1 h-2">
                            <FaRegCalendarAlt className="flex justify-left items-center" size={13} />
                            <span className="flex justify-left items-center text-sm">
                                {moment(props.blog.updatedAt).format('LL')}
                            </span>
                        </p>
                    </div>
                </CardHeader>
            </Card>
        </Link>
    )
}

export default BlogCard;
