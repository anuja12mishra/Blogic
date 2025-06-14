import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import logo from '@/assets/logo.png'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { RouteIndex, RouteSignUp } from '@/helpers/RouteName';
import { showtoast } from '@/helpers/showtoast';
import { getEnv } from '@/helpers/getEnv';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import slugify from 'slugify';
const formSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 character long"),
    slug: z.string().min(3, 'Slug must be at least 3 character long'),
});

function AddCategory() {
    //form 
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            slug: '',
        },
    });

    //use effect
    const watchedName = form.watch('name');

    useEffect(() => {
        if (watchedName) {
            const slug = slugify(watchedName, { lower: true });
            form.setValue('slug', slug);
        } else {
            form.setValue('slug', '');
        }
    }, [watchedName, form]);
    async function onSubmit(values) {
        //console.log(values);
        // try {
        //     const res = await fetch(`${getEnv('VITE_API_URL')}/api/auth/login`, {
        //         method: 'POST',
        //         credentials: 'include',
        //         headers: { 'Content-Type': 'application/json' },
        //         body: JSON.stringify(values)
        //     });

        //     // Always await the response parsing
        //     const data = await res.json();
        //     // console.log('Server response:', data);

        //     if (!res.ok) {
        //         // Server returned an error (like 500)
        //         const errorMessage = data.message || `Server error: ${res.status}`;
        //         showtoast('error', errorMessage);
        //         return;
        //     }

        //     dispatch(setUser(data.user));

        //     // Success case
        //     const successMessage = data.message || 'Registration successful!';
        //     showtoast('success', successMessage);
        //     navigate(RouteIndex);

        // } catch (err) {
        //     // console.error('Request failed:', err);
        //     showtoast('error', 'Network error: Unable to connect to server');
        // }
    }

    return (
        <div>
            <Card className='max-w-screen-md mx-auto'>
                <CardHeader>
                    Add a new Category
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} >
                            <div className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter the category name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="slug"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Slug</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter the slug"  {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full cursor-pointer">
                                    Submit
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>

            </Card>
        </div>
    );
};

export default AddCategory