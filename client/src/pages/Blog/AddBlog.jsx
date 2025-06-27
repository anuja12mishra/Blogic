import React, { use, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { showtoast } from '@/helpers/showtoast';
import { getEnv } from '@/helpers/getEnv';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import slugify from 'slugify';
import { RouteBlog } from '@/helpers/RouteName';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useFetch } from '@/hooks/useFetch';
import Dropzone from 'react-dropzone';
import Editor from '@/components/Editor';
import { useSelector } from 'react-redux';
import { FaInfoCircle } from 'react-icons/fa';
const formSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters long"),
    category: z.string().min(3, "Category must be at least 3 characters long"),
    slug: z.string().min(3, 'Slug must be at least 3 characters long'),
    blogcontent: z.string().min(3, "Blog content must be at least 3 characters long"),
});

function AddBlog() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const [showGuide, setShowGuide] = useState(false);
    const user = useSelector((state) => state.user);

    const [avatar, setAvatar] = useState();
    const [file, setFile] = useState();

    // Form setup
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            category: '',
            slug: '',
            blogcontent: ''
        },
    });

    //Auto-generate slug from title 
    const watchedTitle = form.watch('title');

    const { data: categoriesdata, loading, error } = useFetch(
        `${getEnv('VITE_API_URL')}/api/category/get-all-category`,
        { method: 'GET', credentials: 'include' },
    )

    useEffect(() => {
        // CHANGED: Generate slug from title instead of category
        if (watchedTitle && watchedTitle.trim()) {
            const slug = slugify(watchedTitle, {
                lower: true,
                strict: true, // Remove special characters
                trim: true
            });
            form.setValue('slug', slug);
        } else {
            form.setValue('slug', '');
        }
    }, [watchedTitle, form]);

    async function onSubmit(values) {
        if (isSubmitting) return;

        // Basic validation
        if (!values.title?.trim() || !values.blogcontent?.trim()) {
            showtoast('error', 'All fields are required');
            return;
        }

        setIsSubmitting(true);

        try {
            const formData = new FormData();
            formData.append('title', values.title.trim());
            formData.append('category', values.category);
            formData.append('slug', values.slug);
            formData.append('blogContent', values.blogcontent.trim()); // Match backend expectation

            // Add authenticated user ID
            if (user?.user?._id) {
                formData.append('author', user.user._id);
            }

            if (file) {
                formData.append('featuredImage', file);
            } else {
                showtoast('error', 'Featured image is required');
                setIsSubmitting(false);
                return;
            }

            const res = await fetch(`${getEnv('VITE_API_URL')}/api/blog/add`, {
                method: 'POST',
                credentials: 'include',
                body: formData
            });

            const data = await res.json();

            if (!res.ok) {
                const errorMessage = data.message || `Server error: ${res.status}`;
                showtoast('error', errorMessage);
                return;
            }

            // Success case
            const successMessage = data.message || 'Blog added successfully!';
            showtoast('success', successMessage);

            // Reset form after successful submission
            handleClearForm();

            // Optional: Navigate to blogs list or the new blog post
            navigate(RouteBlog);

        } catch (err) {
            console.error('Request failed:', err);
            if (err.name === 'TypeError' && err.message.includes('fetch')) {
                showtoast('error', 'Network error: Unable to connect to server');
            } else {
                showtoast('error', 'An unexpected error occurred. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    }


    const handleFileUpload = (files) => {
        const uploadedFile = files[0];
        const preview = URL.createObjectURL(uploadedFile);
        setFile(uploadedFile); // ✅ send this to backend
        setAvatar(preview);    // ✅ this is just for displaying image
    }

    const handleClearForm = () => {
        form.reset();
        setAvatar(null);
        setFile(null);
        // Clean up any existing object URLs to prevent memory leaks
        if (avatar) {
            URL.revokeObjectURL(avatar);
        }
    }

    return (
        <div className="container flex justify-center items-center mx-auto p-4 ">
            <Card>
                <CardHeader>
                    <h1 className='text-2xl font-bold text-left border-b-2 pb-2 border-gray-300'>
                        Add a New Blog
                    </h1>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Category</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className='w-full'>
                                                        <SelectValue placeholder="Select Category" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className='bg-white'>
                                                    {
                                                        categoriesdata && categoriesdata?.categories.length > 0 ?
                                                            categoriesdata.categories.map((category, index) => {
                                                                return <SelectItem key={index} value={category._id}>{category.name}</SelectItem>
                                                            })
                                                            :
                                                            <div className="px-2 py-1.5 text-sm text-gray-500">No categories available</div>
                                                    }
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter the title"
                                                    disabled={isSubmitting}
                                                    {...field}
                                                />
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
                                                <Input
                                                    placeholder="Auto-generated from title"
                                                    disabled={isSubmitting}
                                                    readOnly
                                                    className="bg-gray-100 cursor-not-allowed"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                            <p className="text-sm text-gray-500">
                                                The slug is automatically generated from the blog title
                                            </p>
                                        </FormItem>
                                    )}
                                />
                                <div>
                                    <FormLabel className='mb-2 block'>Featured Image</FormLabel>
                                    <Dropzone
                                        onDrop={acceptedFiles => handleFileUpload(acceptedFiles)}
                                        accept={{
                                            'image/*': ['.jpeg', '.jpg', '.png', '.webp']
                                        }}
                                        maxFiles={1}
                                    >
                                        {({ getRootProps, getInputProps, isDragActive }) => (
                                            <div {...getRootProps()}>
                                                <input {...getInputProps()} />
                                                <div className={`flex justify-center items-center w-full lg:w-72 h-56 border-2 border-dashed rounded cursor-pointer transition-colors ${isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                                                    }`}>
                                                    {avatar ? (
                                                        <img
                                                            src={avatar}
                                                            alt="Preview"
                                                            className="max-w-full max-h-full object-contain rounded"
                                                        />
                                                    ) : (
                                                        <div className="text-center text-gray-500">
                                                            <p>Drag & drop an image here, or click to select</p>
                                                            <p className="text-sm mt-1">Supports: JPG, PNG, WebP</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </Dropzone>
                                </div>
                                <FormField
                                    control={form.control}
                                    name="blogcontent"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className='flex justify-between items-center relative'>
                                                <FormLabel>Blog Content</FormLabel>

                                                <div className='flex items-center gap-2'>
                                                    <Button className='w-fit'>✦ Generate with AI ✦</Button>

                                                    {/* Info Icon */}
                                                    <button
                                                        onClick={() => setShowGuide(!showGuide)}
                                                        className='text-blue-600 hover:text-blue-800'
                                                    >
                                                        <FaInfoCircle />
                                                    </button>
                                                </div>

                                                {/* Tooltip/Guide Popup */}
                                                {showGuide && (
                                                    <div className="absolute right-0 top-10 z-10 w-64 p-3 bg-white border border-gray-300 rounded-md shadow-md text-sm text-gray-700">
                                                        <p className='font-semibold mb-1'>AI Content Generation Guide:</p>
                                                        <ul className='list-disc ml-4 space-y-1'>
                                                            <li>Click "Generate with AI" to auto-generate blog ideas.</li>
                                                            <li>Provide a short topic/keyword in the title field first.</li>
                                                            <li>Edit or refine the generated content as needed.</li>
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                            <FormControl>
                                                <div className="w-full max-w-full h-72 overflow-hidden rounded border border-gray-300">
                                                    <Editor
                                                        onChange={(data) => {
                                                            field.onChange(data);
                                                        }}
                                                        {...field}
                                                        props={{ initialData: '' }}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="flex gap-4">
                                    <Button
                                        type="submit"
                                        className="flex-1"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Adding Blog...' : 'Add Blog'}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="flex-1"
                                        onClick={handleClearForm}
                                        disabled={isSubmitting}
                                    >
                                        Clear Form
                                    </Button>
                                </div>

                                {/* Link to view Blogs */}
                                <div className="text-center">
                                    <Button asChild variant="outline">
                                        <Link to={RouteBlog}>
                                            View All Blogs
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}

export default AddBlog;