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
import { RootState } from '@/store';
import { FaInfoCircle, FaSpinner } from 'react-icons/fa';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const formSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters long"),
    category: z.string().min(3, "Category must be at least 3 characters long"),
    slug: z.string().min(3, 'Slug must be at least 3 characters long'),
    blogcontent: z.string().min(3, "Blog content must be at least 3 characters long"),
});

type AddBlogFormValues = z.infer<typeof formSchema>;

function AddBlog() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const navigate = useNavigate();
    const [showGuide, setShowGuide] = useState(false);
    const user = useSelector((state: RootState) => state.user);
    const guideRef = useRef<HTMLDivElement>(null);

    // AI content generation states
    const [generatedContent, setGeneratedContent] = useState('');
    const [shouldUpdateEditor, setShouldUpdateEditor] = useState(false);

    const [avatar, setAvatar] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);

    // Form setup
    const form = useForm<AddBlogFormValues>({
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

    const { data: categoriesdata, loading, error } = useFetch<{categories: any[]}>(
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
                    category: categoriesdata?.categories.find((cat: any) => cat._id === currentValues.category)?.name,
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
            const cleanContentAdvanced = (content: string) => {
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
        function handleClickOutside(event: MouseEvent) {
            if (guideRef.current && !guideRef.current.contains(event.target as Node)) {
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

    async function onSubmit(values: AddBlogFormValues) {
        if (isSubmitting) return;

        // Basic validation
        if (!values.title?.trim() || !values.blogcontent?.trim()) {
            showtoast('error', 'All fields are required');
            return;
        }
        if (!values.category) {
            showtoast('error', 'Category is required');
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

        } catch (err: any) {
            console.error('Request failed:', err);
            if (err.name === 'TypeError' && err.message?.includes('fetch')) {
                showtoast('error', 'Network error: Unable to connect to server');
            } else {
                showtoast('error', 'An unexpected error occurred. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    const handleFileUpload = (files: File[]) => {
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

    const handleInfoClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setShowGuide(!showGuide);
    }

    const onInvalid = (errors: any) => {
        if (errors.category) {
            showtoast('error', 'Please select a category');
            return;
        }
        if (errors.title) {
            showtoast('error', 'Please enter a title');
            return;
        }
        if (errors.blogcontent) {
            showtoast('error', 'Please enter a blog content');
            return;
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-12">
            <div className="flex flex-col gap-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/50 pb-8">
                    <div>
                        <h1 className='text-4xl font-extrabold tracking-tight text-foreground mb-2'>
                            Create New Post
                        </h1>
                        <p className="text-muted-foreground text-lg italic">
                            Share your thoughts with the world.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            asChild
                            disabled={isSubmitting || isGenerating}
                        >
                            <Link to={RouteBlog}>Cancel</Link>
                        </Button>
                        <Button
                            onClick={handleClearForm}
                            variant="ghost"
                            className="text-muted-foreground hover:text-destructive"
                            disabled={isSubmitting || isGenerating}
                        >
                            Clear
                        </Button>
                    </div>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-12">
                        {/* Top Section: Category & Featured Image */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                            {/* Left Column: Form Fields */}
                            <div className="lg:col-span-12 space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <FormField
                                        control={form.control}
                                        name="category"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                                    Category
                                                    <span className="text-purple-600 font-black">*</span>
                                                </FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className='h-12 border-border/50 bg-secondary/20 focus:ring-purple-500/20'>
                                                            <SelectValue placeholder="Where does this belong?" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent className='bg-background border-border shadow-2xl'>
                                                        {categoriesdata && categoriesdata.categories && categoriesdata.categories.length > 0 ?
                                                            categoriesdata.categories.map((category: any) => (
                                                                <SelectItem key={category._id} value={category._id}>
                                                                    {category.name}
                                                                </SelectItem>
                                                            )) :
                                                            <div className="px-2 py-1.5 text-sm text-muted-foreground">No categories found</div>
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
                                                <FormLabel className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                                    Post Title
                                                    <span className="text-purple-600 font-black">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="An evocative title..."
                                                        className="h-12 border-border/50 bg-secondary/20 focus:ring-purple-500/20 text-lg font-medium"
                                                        disabled={isSubmitting || isGenerating}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="slug"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">Permalink Slug</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="auto-generated-slug"
                                                    disabled={true}
                                                    className="bg-muted/50 border-none h-9 text-xs font-mono text-muted-foreground"
                                                    {...field}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Featured Image Full Width */}
                            <div className="lg:col-span-12">
                                <FormLabel className='text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4 block'>
                                    Featured Image
                                    <span className="text-purple-600 font-black ml-1">*</span>
                                </FormLabel>
                                <Dropzone
                                    onDrop={acceptedFiles => handleFileUpload(acceptedFiles)}
                                    accept={{ 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] }}
                                    maxFiles={1}
                                    disabled={isSubmitting || isGenerating}
                                >
                                    {({ getRootProps, getInputProps, isDragActive }) => (
                                        <div {...getRootProps()} className="group outline-none">
                                            <input {...getInputProps()} />
                                            <div className={cn(
                                                "relative flex flex-col justify-center items-center w-full min-h-[300px] border-2 border-dashed rounded-3xl cursor-pointer transition-all duration-300",
                                                isDragActive ? "border-purple-600 bg-purple-50/50 scale-[0.99]" :
                                                    avatar ? "border-transparent bg-secondary/20" : "border-border/50 hover:border-purple-400 hover:bg-secondary/20"
                                            )}>
                                                {avatar ? (
                                                    <div className="relative w-full h-full p-4 group">
                                                        <img
                                                            src={avatar}
                                                            alt="Preview"
                                                            className="w-full max-h-[500px] object-cover rounded-2xl shadow-2xl transition-transform duration-500 group-hover:scale-[1.01]"
                                                        />
                                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl">
                                                            <p className="text-white font-bold px-6 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/50">Change Image</p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="text-center space-y-4 p-12">
                                                        <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <p className="text-xl font-bold text-foreground">Click or drag image here</p>
                                                            <p className="text-muted-foreground">High resolution images work best for bLogic posts.</p>
                                                        </div>
                                                        <div className="flex justify-center gap-2">
                                                            <Badge variant="outline" className="bg-secondary/50 border-border/50">JPG</Badge>
                                                            <Badge variant="outline" className="bg-secondary/50 border-border/50">PNG</Badge>
                                                            <Badge variant="outline" className="bg-secondary/50 border-border/50">WEBP</Badge>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </Dropzone>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="space-y-6">
                            <div className='flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-border/50'>
                                <div>
                                    <FormLabel className="text-lg font-extrabold text-foreground">Content Editor</FormLabel>
                                    <p className="text-sm text-muted-foreground">Use the toolbar to style your story.</p>
                                </div>

                                <div className='flex items-center gap-3 relative'>
                                    <Button
                                        type="button"
                                        className='relative overflow-hidden bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-none px-6 py-6 rounded-2xl shadow-lg shadow-purple-500/20 group animate-pulse hover:animate-none'
                                        onClick={generateContent}
                                        disabled={isSubmitting || isGenerating}
                                    >
                                        {isGenerating ? (
                                            <>
                                                <FaSpinner className="animate-spin mr-2" size={16} />
                                                Magically writing...
                                            </>
                                        ) : (
                                            <span className="flex items-center gap-2 font-bold tracking-tight">
                                                ✦ Generate with AI ✦
                                            </span>
                                        )}
                                    </Button>

                                    <button
                                        type="button"
                                        onClick={handleInfoClick}
                                        className='text-muted-foreground hover:text-purple-600 p-2 rounded-xl hover:bg-purple-50 transition-all'
                                        aria-label="Show AI generation guide"
                                    >
                                        <FaInfoCircle size={20} />
                                    </button>

                                    {showGuide && (
                                        <div
                                            ref={guideRef}
                                            className="absolute right-0 top-20 z-50 w-80 p-6 bg-background/95 backdrop-blur-md border border-border shadow-2xl rounded-3xl animate-in fade-in zoom-in duration-300"
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <h4 className='font-bold text-lg text-foreground'>Magic Writing ✦</h4>
                                                <button
                                                    type="button"
                                                    onClick={() => setShowGuide(false)}
                                                    className="text-muted-foreground hover:text-foreground p-1 transition-colors"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            </div>
                                            <ul className='space-y-3 text-sm text-foreground/80 leading-relaxed font-medium'>
                                                <li className="flex gap-2"><span>1.</span> Enter a descriptive title first.</li>
                                                <li className="flex gap-2"><span>2.</span> Select a matching category.</li>
                                                <li className="flex gap-2"><span>3.</span> Let bLogic AI draft the story.</li>
                                                <li className="flex gap-2"><span>4.</span> Refine and add your personal touch.</li>
                                            </ul>
                                            <div className="mt-6 pt-4 border-t border-border/50 flex justify-center">
                                                <Badge className="bg-purple-600/10 text-purple-600 border-purple-200">5 Daily Generations Free</Badge>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <FormField
                                control={form.control}
                                name="blogcontent"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <div className="w-full max-w-full min-h-[500px] overflow-hidden rounded-3xl border border-border/50 bg-secondary/5 shadow-inner">
                                                <Editor
                                                    onChange={field.onChange}
                                                    props={{ initialData: field.value }}
                                                    generatedContent={generatedContent}
                                                    shouldUpdateContent={shouldUpdateEditor}
                                                    onContentUpdated={handleContentUpdated}
                                                />
                                            </div>
                                        </FormControl>
                                        <div className="flex items-center justify-between px-2">
                                            <FormMessage />
                                        </div>
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Submit Actions */}
                        <div className="pt-8 border-t border-border/50 flex flex-col sm:flex-row gap-4 justify-end">
                            <Button
                                type="submit"
                                size="lg"
                                className="px-12 py-7 rounded-2xl text-lg font-bold bg-purple-600 hover:bg-purple-700 shadow-xl shadow-purple-600/20"
                                disabled={isSubmitting || isGenerating}

                            >
                                {isSubmitting ? (
                                    <>
                                        <FaSpinner className="animate-spin mr-2" />
                                        Publishing...
                                    </>
                                ) : 'Publish Post'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}

export default AddBlog;