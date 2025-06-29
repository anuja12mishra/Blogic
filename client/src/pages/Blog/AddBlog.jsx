import React, { use, useEffect, useState, useRef } from 'react';
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
import { FaInfoCircle, FaSpinner } from 'react-icons/fa';

const formSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters long"),
    category: z.string().min(3, "Category must be at least 3 characters long"),
    slug: z.string().min(3, 'Slug must be at least 3 characters long'),
    blogcontent: z.string().min(3, "Blog content must be at least 3 characters long"),
});

function AddBlog() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const navigate = useNavigate();
    const [showGuide, setShowGuide] = useState(false);
    const user = useSelector((state) => state.user);
    const guideRef = useRef(null);

    // AI content generation states
    const [generatedContent, setGeneratedContent] = useState('');
    const [shouldUpdateEditor, setShouldUpdateEditor] = useState(false);

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

    // Auto-generate slug from title 
    const watchedTitle = form.watch('title');

    const { data: categoriesdata, loading, error } = useFetch(
        `${getEnv('VITE_API_URL')}/api/category/get-all-category`,
        { method: 'GET', credentials: 'include' },
    );

    const generateContent = async () => {
        const currentValues = form.getValues();

        if (!currentValues.title?.trim()) {
            showtoast('error', 'Title is required to generate blog content');
            return;
        }

        if (!currentValues.category) {
            showtoast('error', 'Category is required to generate blog content');
            return;
        }

        try {
            setIsGenerating(true);

            const res = await fetch(`${getEnv('VITE_API_URL')}/api/blog/genrate-content`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    title: currentValues.title.trim(),
                    body: currentValues.blogcontent,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                const errorMessage = data.message || `Server error: ${res.status}`;
                showtoast('error', errorMessage);
                return;
            }

            // Update the generated content and trigger editor update
            // data.content = JSON.parse(data.content);
            const cleanContentAdvanced = (content) => {
                if (!content || typeof content !== 'string') return '';

                return content
                    // Remove code block markers with optional language specification
                    .replace(/^```[\w]*\s*/gm, '')
                    .replace(/\s*```$/gm, '')
                    // Remove inline backticks at start/end of entire content
                    .replace(/^`+/, '')
                    .replace(/`+$/, '')
                    // Clean up extra whitespace
                    .replace(/^\s+|\s+$/g, '')
                    // Remove multiple consecutive newlines
                    .replace(/\n\s*\n\s*\n/g, '\n\n');
            };
            setGeneratedContent(cleanContentAdvanced(data.content));
            setShouldUpdateEditor(true);

            // Update form field
            form.setValue('blogcontent', data.content);

            showtoast('success', 'Blog content generated successfully!');
        } catch (err) {
            console.error('Content generation failed:', err);
            showtoast('error', 'Failed to generate content. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    // Handle editor content update completion
    const handleContentUpdated = () => {
        setShouldUpdateEditor(false);
    };

    // Handle click outside to close guide
    useEffect(() => {
        function handleClickOutside(event) {
            if (guideRef.current && !guideRef.current.contains(event.target)) {
                setShowGuide(false);
            }
        }

        if (showGuide) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showGuide]);

    useEffect(() => {
        // Generate slug from title
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
        setFile(uploadedFile);
        setAvatar(preview);
    }

    const handleClearForm = () => {
        form.reset();
        setAvatar(null);
        setFile(null);
        setShowGuide(false); // Close guide when clearing form
        setGeneratedContent(''); // Clear generated content
        setShouldUpdateEditor(false);

        if (avatar) {
            URL.revokeObjectURL(avatar);
        }
    }

    const handleInfoClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setShowGuide(!showGuide);
    }

    return (
        <div className="container flex justify-center items-center mx-auto p-4">
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
                                                    disabled={isSubmitting || isGenerating}
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
                                                    disabled={isSubmitting || isGenerating}
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
                                        disabled={isSubmitting || isGenerating}
                                    >
                                        {({ getRootProps, getInputProps, isDragActive }) => (
                                            <div {...getRootProps()}>
                                                <input {...getInputProps()} />
                                                <div className={`flex justify-center items-center w-full lg:w-72 h-56 border-2 border-dashed rounded cursor-pointer transition-colors ${isDragActive ? 'border-blue-400 bg-blue-50' :
                                                    (isSubmitting || isGenerating) ? 'border-gray-200 bg-gray-50 cursor-not-allowed' :
                                                        'border-gray-300 hover:border-gray-400'
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
                                            <div className='flex justify-between items-center mb-2'>
                                                <FormLabel>Blog Content</FormLabel>

                                                <div className='flex items-center gap-2 relative'>
                                                    <Button
                                                        type="button"
                                                        className='w-fit flex items-center gap-2'
                                                        onClick={generateContent}
                                                        disabled={isSubmitting || isGenerating}
                                                    >
                                                        {isGenerating ? (
                                                            <>
                                                                <FaSpinner className="animate-spin" size={14} />
                                                                Generating...
                                                            </>
                                                        ) : (
                                                            '✦ Generate with AI ✦'
                                                        )}
                                                    </Button>
                                                    {/* Info Icon */}
                                                    <button
                                                        type="button"
                                                        onClick={handleInfoClick}
                                                        className='text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50 transition-colors disabled:opacity-50'
                                                        aria-label="Show AI generation guide"
                                                        disabled={isSubmitting || isGenerating}
                                                    >
                                                        <FaInfoCircle size={16} />
                                                    </button>

                                                    {/* Tooltip/Guide Popup */}
                                                    {showGuide && (
                                                        <div
                                                            ref={guideRef}
                                                            className="absolute right-0 top-8 z-50 w-80 p-4 bg-white border border-gray-200 rounded-lg shadow-lg text-sm text-gray-700"
                                                            style={{ boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}
                                                        >
                                                            <div className="flex justify-between items-start mb-2">
                                                                <p className='font-semibold text-gray-800'>AI Content Generation Guide:</p>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setShowGuide(false)}
                                                                    className="text-gray-400 hover:text-gray-600 ml-2"
                                                                    aria-label="Close guide"
                                                                >
                                                                    ×
                                                                </button>
                                                            </div>
                                                            <ul className='list-disc ml-4 space-y-1.5 text-gray-600'>
                                                                <li>Enter a descriptive title for your blog post first.</li>
                                                                <li>Select a category that matches your content.</li>
                                                                <li>Click "Generate with AI" to create initial content.</li>
                                                                <li>Edit and refine the generated content as needed.</li>
                                                                <li>The AI will create a structured blog post based on your title.</li>
                                                                <li>You have <strong>5</strong> free AI generations per day.</li>
                                                            </ul>
                                                            {/* Small arrow pointing to the info icon */}
                                                            <div className="absolute -top-2 right-6 w-4 h-4 bg-white border-l border-t border-gray-200 transform rotate-45"></div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <FormControl>
                                                <div className="w-full max-w-full h-fit overflow-hidden rounded border border-gray-300">
                                                    <Editor
                                                        onChange={(data) => {
                                                            field.onChange(data);
                                                        }}
                                                        props={{ initialData: field.value }}
                                                        generatedContent={generatedContent}
                                                        shouldUpdateContent={shouldUpdateEditor}
                                                        onContentUpdated={handleContentUpdated}
                                                    />
                                                </div>
                                            </FormControl>
                                            <p className="text-xs text-black">
                                                <strong>Note:</strong> Please click the <em>Full Screen</em> button in the toolbar to enable full view.
                                            </p>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="flex gap-4">
                                    <Button
                                        type="submit"
                                        className="flex-1"
                                        disabled={isSubmitting || isGenerating}
                                    >
                                        {isSubmitting ? 'Adding Blog...' : 'Add Blog'}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="flex-1"
                                        onClick={handleClearForm}
                                        disabled={isSubmitting || isGenerating}
                                    >
                                        Clear Form
                                    </Button>
                                </div>

                                {/* Link to view Blogs */}
                                <div className="text-center">
                                    <Button asChild variant="outline" disabled={isSubmitting || isGenerating}>
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