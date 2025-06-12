import React from 'react'
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { useSelector } from 'react-redux';

function Profile() {
    const user = useSelector((state) => state.user);


    return (
        
        <Card className='mt-30 p-70'>
            <div className="flex justify-center items-center">
                <Avatar>
                    <AvatarImage src={user.user.avatar} />
                </Avatar>
            </div>
        </Card>
    )
}

export default Profile