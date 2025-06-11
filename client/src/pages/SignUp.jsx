import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import logo from '@/assets/logo.png'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { RouteSignIn } from '@/helpers/RouteName';
import { getEnv } from '@/helpers/getEnv';
import { showtoast } from '@/helpers/showtoast';
import GoogleLogin from '../components/GoogleLogin';

const formSchema = z.object({
    name: z.string().min(3, 'Name should have a minimum length of 3'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(4, 'Password must be at least 4 characters long'),
    confirmpassword: z.string()
}).refine((data) => data.password === data.confirmpassword, {
    message: 'Passwords do not match',
    path: ['confirmpassword'],
});

const Signup = () => {
    const navigate = useNavigate();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: '',
            name: '',
            confirmpassword: ''
        },
    });

    async function onSubmit(values) {
        // console.log('Form values:', values);

        try {
            const res = await fetch(`${getEnv('VITE_API_URL')}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values)
            });

            // Always await the response parsing
            const data = await res.json();
            // console.log('Server response:', data);

            if (!res.ok) {
                // Server returned an error (like 500)
                const errorMessage = data.message || `Server error: ${res.status}`;
                showtoast('error', errorMessage);
                return;
            }

            // Success case
            const successMessage = data.message || 'Registration successful!';
            showtoast('success', successMessage);
            navigate(RouteSignIn);

        } catch (err) {
            // console.error('Request failed:', err);
            showtoast('error', 'Network error: Unable to connect to server');
        }
    }

    return (
        <div className="flex flex-col justify-center items-center min-h-screen p-6 maze-background relative">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-[270px] sm:w-[350px] md:w-[450px] space-y-6 border-2 border-gray-300 rounded-lg p-6 bg-white relative z-50">
                    <div className="flex justify-center mb-3">
                        <img src={logo} alt="logo-image" width={65} className="bg-transparent drop-shadow-lg" />
                    </div>
                    <h1 className='text-2xl text-center py-1 border-b-2 border-gray-300'>Create your Account</h1>
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter your Name" {...field} />
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
                                    <Input placeholder="Enter your email (Gmail only)" {...field} />
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
                    <FormField
                        control={form.control}
                        name="confirmpassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirm Password</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter your password again" type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full bg-purple-400 hover:bg-purple-500 transition duration-300 cursor-pointer">
                        Submit
                    </Button>
                    <div className='flex gap-2 justify-center'>
                        <p className='text-xs text-center'>Already have an account ?</p>
                        <Link className='font-bold text-xs text-blue-600' to={RouteSignIn}> Sign In</Link>
                    </div>
                    <div className="flex items-center gap-2 my-4">
                        <hr className="flex-grow border-t border-gray-300" />
                        <p className="text-xs font-bold text-center">Or</p>
                        <hr className="flex-grow border-t border-gray-300" />
                    </div>

                    <div className='w-full p-0'>
                        <GoogleLogin />
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default Signup;