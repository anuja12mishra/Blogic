import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { Badge } from "@/components/ui/badge";
import { useSelector } from 'react-redux';
import { FaRegCalendarAlt } from "react-icons/fa";
import moment from 'moment';
import { Link } from 'react-router-dom';
import { RoutePublicProfile, RouteSingleBlogDetails } from '@/helpers/RouteName';
import { RootState } from '@/store';

interface BlogCardProps {
    props: {
        blog: {
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
        };
    };
}

const BlogCard: React.FC<BlogCardProps> = ({ props }) => {
    return (
        <Link to={RouteSingleBlogDetails(props.blog.category.slug, props.blog.slug, props.blog._id)}>
            <Card className="h-full hover:scale-105 transition-transform duration-300 hover:border-purple-600 hover:border-1.5">
                <CardHeader className="h-full flex flex-col">
                    <div className="flex flex-col max-md:flex-row justify-between w-full gap-2 mb-2">
                        <div className="flex items-center gap-1.5">
                            <Link to={RoutePublicProfile(props?.blog?.author?.username)} onClick={(e) => e.stopPropagation()}>
                                <Avatar className="flex items-center gap-1">
                                    <AvatarImage src={props?.blog?.author?.avatar} referrerPolicy="no-referrer" className="h-10 w-10 rounded-full object-cover border-2" />
                                    <p className="truncate hover:text-purple-600 transition-colors">{props?.blog?.author?.name}</p>
                                    <AvatarFallback />
                                </Avatar>
                            </Link>
                        </div>

                        <div className="flex justify-start max-md:justify-center items-center hover:cursor-default">
                            <Badge
                                variant="secondary"
                                className={`${props.blog.author && props.blog.author.role === "admin" ? 'bg-blue-500' : 'bg-green-500'} text-white rounded-lg px-3 py-1`}
                            >
                                {props.blog.author && props.blog.author.role === "admin" ? 'Admin' : 'User'}
                            </Badge>
                        </div>
                    </div>

                    <div className="w-full h-32 flex justify-center items-center mb-2">
                        <Avatar asChild className="w-full h-full">
                            <AvatarImage
                                src={props.blog.featuredImage}
                                referrerPolicy="no-referrer"
                                className="rounded-md object-contain bg-gray-100 hover:scale-105 transition-transform duration-300"
                            />
                        </Avatar>
                    </div>

                    <div className="mt-auto">
                        <CardTitle className="text-xl font-bold line-clamp-1 mb-2">
                            {props.blog.title}
                        </CardTitle>
                        <div className="flex justify-left items-center gap-1 h-2">
                            <FaRegCalendarAlt size={13} />
                            <span className="text-sm">
                                {moment(props.blog.updatedAt).format('LL')}
                            </span>
                        </div>
                    </div>
                </CardHeader>
            </Card>
        </Link>
    );
};

export default BlogCard;
