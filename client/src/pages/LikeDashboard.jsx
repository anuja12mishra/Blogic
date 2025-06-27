import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { 
    Table, 
    TableBody, 
    TableCaption, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { getEnv } from '@/helpers/getEnv';
import { useFetch } from '@/hooks/useFetch';
import { MdDeleteOutline } from 'react-icons/md';
import moment from 'moment';
import React, { useState } from 'react';
import Loading from '@/components/Loading';

function LikeDashboard() {
    const [refresh, setRefresh] = useState(false);
    
    const { data: LikeData, loading, error } = useFetch(
        `${getEnv('VITE_API_URL')}/api/like/protected-get-likes`,
        { method: 'GET', credentials: 'include' },
        [refresh]
    );

    //console.log('LikeData', LikeData);

    const likes = LikeData?.like || [];

    const handleDelete = async (likeId) => {
        try {
            const response = await fetch(
                `${getEnv('VITE_API_URL')}/api/like/delete-like/${likeId}`,
                {
                    method: 'DELETE',
                    credentials: 'include',
                }
            );

            if (response.ok) {
                setRefresh(!refresh); // Trigger refresh
                console.log('Like deleted successfully');
            } else {
                console.error('Failed to delete like');
            }
        } catch (error) {
            console.error('Error deleting like:', error);
        }
    };

    if (loading) {
        return ( 
           <Loading />
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-lg text-red-500">Error loading likes: {error.message}</div>
            </div>
        );
    }

    return (
        <div>
            <Card className='md:w-6xl'>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold">Likes Dashboard</h2>
                        <div className="text-sm text-gray-500">
                            Total: {likes.length} likes
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableCaption>
                            {likes.length > 0
                                ? `A list of ${likes.length} likes.`
                                : "No likes found."
                            }
                        </TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Blog Title</TableHead>
                                <TableHead>Blog Author</TableHead>
                                <TableHead>Liked By</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {likes && likes.length > 0 ? (
                                likes.map((like) => (
                                    <TableRow key={like._id}>
                                        <TableCell className="font-medium">
                                            {like.blogId?.title || 'No title'}
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">
                                                    {like.blogId?.author?.name || 'Unknown author'}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {like.blogId?.author?.email}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">
                                                    {like.authorId?.name || 'Unknown user'}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {like.authorId?.email}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className='w-fit'>
                                            <div className="text-sm">
                                                {moment(like.createdAt).format('MMM DD, YYYY')}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {moment(like.createdAt).format('h:mm A')}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2 justify-end">
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleDelete(like._id)}
                                                    aria-label={`Delete like by ${like.authorId?.name}`}
                                                    className='hover:cursor-pointer'
                                                >
                                                    <MdDeleteOutline size={16} />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <></>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

export default LikeDashboard;