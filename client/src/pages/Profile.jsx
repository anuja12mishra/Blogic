import React, { useEffect, useState } from 'react'
import {
    Card,
    CardContent
} from "@/components/ui/card"
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { useSelector, useDispatch } from 'react-redux';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { RouteIndex } from '@/helpers/RouteName';
import { Textarea } from "@/components/ui/textarea"
import { useFetch } from '@/hooks/useFetch';
import { getEnv } from '@/helpers/getEnv';
import { setUser } from "@/redux/user/user.slice";
import Loading from '@/components/Loading';
import { IoCameraReverseOutline } from "react-icons/io5";
import Dropzone from 'react-dropzone'
import { showtoast } from '@/helpers/showtoast';

const formSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Please enter a valid email address"),
    bio: z.string().min(5, "Bio must be at least 5 characters"),
});


function Profile() {
    const [avatar, setAvatar] = useState();
    const [file, setFile] = useState();
    const [submitting,setSubmiting] = useState(false);
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { data: userData, loading } = useFetch(
        `${getEnv('VITE_API_URL')}/api/user/user-details/${user?.user?._id}`,
        { method: 'GET', credentials: 'include' }
    );

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            name: '',
            bio: ''
        }

    });

    useEffect(() => {
        if (userData?.success && userData.user) {
            form.reset({
                name: userData.user.name || '',
                email: userData.user.email || '',
                bio: userData.user.bio || '',
                password: ''
            });
        }
    }, [userData]);

    if (loading) return <Loading />;


    const handleFileUpload = (files) => {
        const uploadedFile = files[0];
        const preview = URL.createObjectURL(uploadedFile);
        // console.log("handleFileUpload",uploadedFile);
        setFile(uploadedFile); // ✅ send this to backend
        setAvatar(preview);    // ✅ this is just for displaying image
    }


    async function onSubmit(values) {
        setSubmiting(true)
        try {
            const newFormData = new FormData;
            newFormData.append('file', file);
            newFormData.append('user', JSON.stringify(values));
            const res = await fetch(`${getEnv('VITE_API_URL')}/api/user/user-update/${user?.user?._id}`, {
                method: 'PUT',
                credentials: 'include',
                body: newFormData
            });

            const data = await res.json();

            if (!res.ok) {
                showtoast('error', data.message || `Server error: ${res.status}`);
                return;
            }

            dispatch(setUser(data.user));
            showtoast('success', data.message || 'Profile updated successfully!');

        } catch (err) {
            showtoast('error', 'Network error: Unable to connect to server');
        }finally{
            setSubmiting(false);
        }
    }

    return (
        <Card className="max-w-screen-md mx-auto">
            <CardContent>
                <div className='w-full h-full flex justify-center items-center'>
                    <Dropzone onDrop={acceptedFiles => handleFileUpload(acceptedFiles)}>
                        {({ getRootProps, getInputProps }) => (

                            <div {...getRootProps()}>
                                <input {...getInputProps()} />
                                <div className="relative w-24 h-24">
                                    <Avatar className="w-full h-full">
                                        <AvatarImage className='object-cover' src={avatar ? avatar : userData?.user?.avatar || ''} />
                                    </Avatar>
                                    <button
                                        type="button"
                                        className="absolute bottom-1 right-1 bg-white p-1 rounded-full shadow hover:bg-gray-200 cursor-pointer"
                                    >
                                        <IoCameraReverseOutline size={20} />
                                    </button>
                                </div>
                            </div>


                        )}
                    </Dropzone>

                </div>

                <div className="w-full">
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <Form {...form}>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter your name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter your email"
                                                {...field}
                                                
                                                className="bg-readOnlygray-100 cursor-not-allowed"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="bio"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Bio</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Enter your bio" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/*
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="Enter your password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />*/}
                            <Button type="submit" className="w-full transition duration-300 cursor-pointer" disabled={submitting} >
                                {submitting?'Saveing changes....':'Save changes'}
                                
                            </Button>
                        </Form>
                    </form>
                </div>
            </CardContent>
        </Card>
    );
}

export default Profile;
