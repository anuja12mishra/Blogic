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
                                <AvatarImage src={props?.blog?.author?.avatar} className="h-10 w-10 rounded-full object-cover border-2" />
                                <p className="truncate">{props?.blog?.author?.name}</p>
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
                                className="rounded-md object-contain bg-gray-100 hover:scale-105 transition-transform duration-300"
                            />
                        </Avatar>
                    </div>
                    {/* <div className="w-full h-32 flex justify-center items-center mb-2">
                        <Avatar asChild className="w-full h-full">
                            <AvatarImage
                                src={props.blog.featuredImage}
                                className="rounded-md object-cover hover:scale-105 transition-transform duration-300"
                            />
                        </Avatar>
                    </div> */}

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
