import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import logo from '@/assets/logo.png';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { RouteIndex, RouteSignUp } from '@/helpers/RouteName';
import { showtoast } from '@/helpers/showtoast';
import { getEnv } from '@/helpers/getEnv';
import { useDispatch } from 'react-redux';
import { setUser } from '@/redux/user/user.slice';
import GoogleLogin from '@/components/GoogleLogin';
import Loading from '@/components/Loading';
import { AppDispatch } from '@/redux/store';

const formSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(4, 'Password must be at least 4 characters long'),
});

type SignInFormValues = z.infer<typeof formSchema>;

const SignIn: React.FC = () => {
    const [loading, setLoading] = React.useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const form = useForm<SignInFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    async function onSubmit(values: SignInFormValues) {
        setLoading(true);
        try {
            const res = await fetch(`${getEnv('VITE_API_URL')}/api/auth/login`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values)
            });

            const data = await res.json();

            if (!res.ok) {
                const errorMessage = data.message || `Server error: ${res.status}`;
                showtoast('error', errorMessage);
                return;
            }

            dispatch(setUser(data.user));
            showtoast('success', data.message || 'Login successful!');
            navigate(RouteIndex);

        } catch (err) {
            showtoast('error', 'Network error: Unable to connect to server');
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <Loading />;

    return (
        <div className="flex flex-col justify-center items-center min-h-screen p-6 maze-background relative">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-[270px] sm:w-[350px] md:w-[450px] space-y-6 border-2 border-border rounded-lg p-6 bg-card relative z-50">
                    <div className="flex justify-center mb-3">
                        <img src={logo} alt="logo-image" width={65} className="bg-transparent drop-shadow-lg" />
                    </div>
                    <h1 className='text-2xl text-center py-1 border-b-2 border-border mb-6'>Login to your account</h1>

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
                        <Button type="submit" className="w-full transition duration-300 cursor-pointer">
                            Submit
                        </Button>
                        <div className='flex gap-2 justify-center'>
                            <p className='text-xs text-center'>Don&apos;t have an account ?</p>
                            <Link className='font-bold text-xs text-blue-600' to={RouteSignUp}> Sign Up</Link>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 my-4">
                        <hr className="flex-grow border-t border-border" />
                        <p className="text-xs font-bold text-center">Or</p>
                        <hr className="flex-grow border-t border-border" />
                    </div>

                    <div className='w-full p-0'>
                        <GoogleLogin loading={loading} setLoading={setLoading} />
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default SignIn;