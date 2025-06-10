import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import logo from '@/assets/logo.png'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { RouteSignUp } from '@/helpers/RouteName';

const formSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(4, 'Password must be at least 4 characters long'),
});

const SignIn = () => {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    function onSubmit(values) {
        console.log(values);
    }

    return (
        <div className="flex flex-col justify-center items-center min-h-screen p-6 maze-background relative">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-[350px] md:w-[450px] border-2 border-gray-300 rounded-lg p-6 bg-white relative z-50">
                    <div className="flex justify-center mb-3">
                        <img src={logo} alt="logo-image" width={65} className="bg-transparent drop-shadow-lg" />
                    </div>
                    <h1 className='text-2xl text-center py-1 border-b-2 border-gray-300 mb-6'>Login to your account</h1>
                    
                    <div className="space-y-6">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your password" type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full bg-purple-400 hover:bg-purple-500 transition duration-300 cursor-pointer">
                            Submit
                        </Button>
                        <div className='flex gap-2 justify-center'>
                            <p className='text-xs text-center'>Don&apos;t have an account ?</p>
                            <Link className='font-bold text-xs text-blue-600' to={RouteSignUp}> Sign Up</Link>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default SignIn;