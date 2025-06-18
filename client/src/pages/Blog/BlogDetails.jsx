import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { RouteAddBlog, RouteBlog, RouteEditBlog } from '@/helpers/RouteName'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useFetch } from '@/hooks/useFetch'
import { showtoast } from '@/helpers/showtoast'
import { getEnv } from '@/helpers/getEnv'
import Loading from '@/components/Loading'
import { MdDeleteOutline } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { handleBlogDelete } from '@/helpers/hangleBlogDelete'
import { MdOutlineRemoveRedEye } from "react-icons/md";
import moment from 'moment'

function BlogDetails() {
    const [refresh, setRefresh] = useState(false);

    // Pass refresh as a dependency to trigger re-fetch
    const { data: blogsData, loading, error } = useFetch(
        `${getEnv('VITE_API_URL')}/api/blog/get-all-blogs`,
        { method: 'GET', credentials: 'include' },
        [refresh]
    );
    //console.log('blogsData', blogsData?.blog)

    const handleDelete = async (id) => {
        try {
            const deleteres = await handleBlogDelete(
                `${getEnv('VITE_API_URL')}/api/blog/delete/${id}`
            );

            if (deleteres && deleteres.success) {
                showtoast('success', deleteres.message);
                setRefresh(prev => !prev); // Use functional update
            } else {
                showtoast('error', deleteres?.message || 'Failed to delete category');
            }
        } catch (error) {
            console.error('Delete error:', error);
            showtoast('error', 'An error occurred while deleting the category');
        }
    };

    // Handle error state
    if (error) {
        return (
            <div className="flex justify-center items-center h-64">
                <Card>
                    <CardContent className="p-6">
                        <p className="text-red-600">Error loading categories: {error.message}</p>
                        <Button
                            onClick={() => setRefresh(prev => !prev)}
                            className="mt-4"
                        >
                            Try Again
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (loading) {
        return <Loading />
    }

    const blogs = blogsData?.blog || [];
    return (
        <div >
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold">Blogs</h2>
                        <Button asChild>
                            <Link to={RouteAddBlog}>
                                Add Blog
                            </Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableCaption>
                            {blogsData?.blog?.length > 0
                                ? `A list of ${blogsData?.blog?.length} blogs.`
                                : "No Blogs found."
                            }
                        </TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Author</TableHead>
                                <TableHead>Category Name</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Slug</TableHead>
                                <TableHead>Dated</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                                blogs.map((data, index) => {
                                    return <TableRow key={index}>
                                        <TableCell>
                                            {data.author?.name}
                                        </TableCell>
                                        <TableCell>
                                            {data.category?.name}
                                        </TableCell>
                                        <TableCell>
                                            {data.title}
                                        </TableCell>
                                        <TableCell>
                                            {data.slug}
                                        </TableCell>
                                        <TableCell>
                                            {moment(data.updatedAt).format('LLLL')}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2 justify-end">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    asChild
                                                    aria-label={`Edit ${data.name}`}
                                                >
                                                    <Link to={RouteEditBlog(data._id)}>
                                                        <FaRegEdit size={16} />
                                                        <span className="sr-only">Edit {data.name}</span>
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    asChild
                                                    aria-label={`Edit ${data.name}`}
                                                >
                                                    <Link to={RouteBlog}>
                                                        <MdOutlineRemoveRedEye size={16} />
                                                        <span className="sr-only">view {data.name}</span>
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleDelete(data._id)}
                                                    className='hover:cursor-pointer'
                                                    aria-label={`Delete ${data.name}`}
                                                >

                                                    <MdDeleteOutline size={16} />
                                                    <span className="sr-only">Delete {data.name}</span>
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                })
                            }

                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}

export default BlogDetails