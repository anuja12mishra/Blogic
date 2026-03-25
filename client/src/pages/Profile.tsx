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
import AnalyticsDashboard from '@/components/AnalyticsDashboard';

const formSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Please enter a valid email address"),
    bio: z.string().min(5, "Bio must be at least 5 characters"),
});


function Profile() {
    const [avatar, setAvatar] = useState();
    const [file, setFile] = useState();
    const [submitting, setSubmiting] = useState(false);
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
        console.log('userData.user',userData?.user)
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
        } finally {
            setSubmiting(false);
        }
    }    return (
        <div className="max-w-6xl mx-auto px-4 py-10 space-y-12">
            <div className="flex flex-col items-center">
                <div className="w-full max-w-2xl">
                    <div className='flex justify-center items-center mb-10'>
                        <Dropzone onDrop={acceptedFiles => handleFileUpload(acceptedFiles)}>
                            {({ getRootProps, getInputProps }) => (
                                <div {...getRootProps()}>
                                    <input {...getInputProps()} />
                                    <div className="relative w-32 h-32 group cursor-pointer">
                                        <Avatar className="w-full h-full rounded-full overflow-hidden border-4 border-background shadow-xl scale-100 group-hover:scale-105 transition-transform duration-300">
                                            <AvatarImage className='h-full w-full object-cover' src={avatar ? avatar : userData?.user?.avatar || ''} />
                                        </Avatar>
                                        <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <IoCameraReverseOutline size={30} className="text-white" />
                                        </div>
                                        <button
                                            type="button"
                                            className="absolute bottom-1 right-1 bg-primary text-primary-foreground p-2 rounded-full shadow-lg border-2 border-background"
                                        >
                                            <IoCameraReverseOutline size={18} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </Dropzone>
                    </div>

                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <Form {...form}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs font-bold uppercase tracking-[0.1em] text-muted-foreground/70 ml-1">Display Name</FormLabel>
                                            <FormControl>
                                                <Input className="bg-muted/30 border-none h-12 text-lg focus-visible:ring-1 focus-visible:ring-primary/30 transition-all" placeholder="Enter your name" {...field} />
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
                                            <FormLabel className="text-xs font-bold uppercase tracking-[0.1em] text-muted-foreground/70 ml-1">Email Address</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter your email"
                                                    {...field}
                                                    readOnly
                                                    className="bg-muted/30 border-none h-12 text-lg cursor-not-allowed opacity-60"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="bio"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs font-bold uppercase tracking-[0.1em] text-muted-foreground/70 ml-1">Your Bio</FormLabel>
                                        <FormControl>
                                            <Textarea 
                                                className="bg-muted/30 border-none min-h-[120px] text-lg resize-none focus-visible:ring-1 focus-visible:ring-primary/30 transition-all px-4 py-3" 
                                                placeholder="Tell the world about yourself..." 
                                                {...field} 
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex justify-center pt-4">
                                <Button 
                                    type="submit" 
                                    className="w-full md:w-auto min-w-[200px] h-12 text-base font-bold transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 active:scale-95 cursor-pointer rounded-xl bg-primary text-primary-foreground" 
                                    disabled={submitting}
                                >
                                    {submitting ? 'Saving changes...' : 'Save Profile Changes'}
                                </Button>
                            </div>
                        </Form>
                    </form>
                </div>
            </div>

            <div className="pt-12 border-t border-border/40">
                <AnalyticsDashboard userId={user?.user?._id} />
            </div>
        </div>
    );
}

export default Profile;
