import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import React, { useEffect, useState } from 'react'
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
import { handleCategoryDelete } from '@/helpers/handleCategoryDelete'
import { useSelector } from 'react-redux'
import moment from 'moment'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'

function UsersDashboard() {
    const [refresh, setRefresh] = useState(false);

    // Pass refresh as a dependency to trigger re-fetch
    const { data: UserData, loading, error } = useFetch(
        `${getEnv('VITE_API_URL')}/api/user/get-all-users`,
        { method: 'GET', credentials: 'include' },
        [refresh]
    );
    // console.log('UserData',UserData)
    const handleDelete = async (id) => {
        try {
            const deleteres = await handleCategoryDelete(
                `${getEnv('VITE_API_URL')}/api/user/delete/${id}`
            );

            if (deleteres && deleteres.success) {
                showtoast('success', deleteres.message);
                setRefresh(prev => !prev);
            } else {
                showtoast('error', deleteres?.message || 'Failed to delete User');
            }
        } catch (error) {
            console.error('Delete error:', error);
            showtoast('error', 'An error occurred while deleting the User');
        }
    };

    // Handle error state
    if (error) {
        return (
            <div className="flex justify-center items-center">
                <Card>
                    <CardContent className="p-6">
                        <p className="text-red-600">Error loading Users: {error.message}</p>
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

    const users = UserData?.user || [];

    return (
        <div>
            <Card className='md:w-6xl'>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold">Users</h2>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table >
                        <TableCaption>
                            {users.length > 0
                                ? `A list of ${users.length} Users.`
                                : "No Users found."
                            }
                        </TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Role</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Avatar</TableHead>
                                <TableHead>Dated</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users && users.length > 0 ? (
                                users.map((user) => (
                                    <TableRow key={user._id}>
                                        <TableCell className="font-medium">
                                            {user.role}
                                        </TableCell>
                                        <TableCell>
                                            {user.name}
                                        </TableCell>
                                        <TableCell>
                                            {user.email}
                                        </TableCell>
                                        <TableCell>
                                            <Avatar className="flex items-center gap-1">
                                                <AvatarImage src={user.avatar} className="h-10 w-10 rounded-full object-cover" />
                                                <AvatarFallback />
                                            </Avatar>
                                        </TableCell>
                                        <TableCell className='w-fit'>
                                            {moment(user.createdAt).format('LLLL')}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2 justify-end">
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleDelete(user._id)}
                                                    aria-label={`Delete ${user.name}`}
                                                    className='hover:cursor-pointer'
                                                >
                                                    <MdDeleteOutline size={16} />
                                                    <span className="sr-only">Delete {user.name}</span>
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
    )
}

export default UsersDashboard


