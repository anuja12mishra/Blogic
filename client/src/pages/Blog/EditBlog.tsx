import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link, useNavigate, useParams } from 'react-router-dom';
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
import { decode } from 'entities'
import Loading from '@/components/Loading';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { FaSpinner } from 'react-icons/fa';

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  category: z.string().min(1, "Please select a category"),
  slug: z.string().min(3, 'Slug must be at least 3 characters long'),
  blogcontent: z.string().min(10, "Blog content must be at least 10 characters long"),
});

function EditBlog() {
  const { blog_id } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  const [avatar, setAvatar] = useState(null);
  const [file, setFile] = useState(null);

  // Fetch categories for dropdown
  const { data: categoriesData } = useFetch(
    `${getEnv('VITE_API_URL')}/api/category/get-all-category`,
    { method: 'GET', credentials: 'include' }
  );

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

  // Fetch blog data to edit
  const { data: blogData, loading: blogLoading } = useFetch(
    `${getEnv('VITE_API_URL')}/api/blog/get-a-blog/${blog_id}`,
    { method: 'GET', credentials: 'include' }
  );

  // Populate form when blog data loads
  useEffect(() => {
    if (blogData?.blog) {
      const { title, category, slug, blogContent, featuredImage } = blogData.blog;

      form.reset({
        title,
        category: category?._id || '',
        slug,
        blogcontent: decode(blogContent)
      });

      setAvatar(featuredImage);
    }
  }, [blogData, form]);

  // Auto-generate slug from title
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'title' && value.title) {
        const generatedSlug = slugify(value.title, {
          lower: true,
          strict: true,
          remove: /[*+~.()'"!:@]/g
        });
        form.setValue('slug', generatedSlug);
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  async function onSubmit(values) {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('title', values.title.trim());
      formData.append('category', values.category);
      formData.append('slug', values.slug);
      formData.append('blogContent', values.blogcontent.trim());

      // Only append file if a new one was selected
      if (file) {
        formData.append('featuredImage', file);
      }
      
      const res = await fetch(`${getEnv('VITE_API_URL')}/api/blog/edit/${blog_id}`, {
        method: 'PUT',
        credentials: 'include',
        body: formData
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || `Server error: ${res.status}`);
      }

      showtoast('success', data.message || 'Blog updated successfully!');
      navigate(RouteBlog);

    } catch (error) {
      console.error('Update failed:', error);
      showtoast('error', error.message || 'Failed to update blog');
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleFileUpload = (acceptedFiles) => {
    const uploadedFile = acceptedFiles[0];
    if (!uploadedFile) return;

    const preview = URL.createObjectURL(uploadedFile);
    setFile(uploadedFile);
    setAvatar(preview);
  };

  if (blogLoading) {
    return <div className="h-screen flex items-center justify-center"><Loading /></div>
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex flex-col gap-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/50 pb-8">
          <div>
            <h1 className='text-4xl font-extrabold tracking-tight text-foreground mb-2'>
              Edit Blog Post
            </h1>
            <p className="text-muted-foreground text-lg italic">
              Refine your masterpiece.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              asChild
              disabled={isSubmitting}
            >
              <Link to={RouteBlog}>Cancel</Link>
            </Button>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
            {/* Top Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
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
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={isSubmitting}
                        >
                          <FormControl>
                            <SelectTrigger className='h-12 border-border/50 bg-secondary/20 focus:ring-purple-500/20'>
                              <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className='bg-background border-border shadow-2xl'>
                            {categoriesData?.categories?.length > 0 ? (
                              categoriesData.categories.map((category) => (
                                <SelectItem key={category._id} value={category._id}>
                                  {category.name}
                                </SelectItem>
                              ))
                            ) : (
                              <div className="px-2 py-1.5 text-sm text-muted-foreground">
                                No categories available
                              </div>
                            )}
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
                            placeholder="Enter the title"
                            className="h-12 border-border/50 bg-secondary/20 focus:ring-purple-500/20 text-lg font-medium"
                            disabled={isSubmitting}
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
                          placeholder="Auto-generated-slug"
                          disabled={true}
                          readOnly
                          className="bg-muted/50 border-none h-9 text-xs font-mono text-muted-foreground"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Featured Image Row */}
              <div className="lg:col-span-12">
                <FormLabel className='text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4 block'>
                  Featured Image
                </FormLabel>
                <Dropzone
                  onDrop={handleFileUpload}
                  accept={{ 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] }}
                  maxFiles={1}
                  disabled={isSubmitting}
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
                              src={typeof avatar === 'string' ? avatar : URL.createObjectURL(avatar)}
                              alt="Preview"
                              className="w-full max-h-[500px] object-cover rounded-2xl shadow-2xl transition-transform duration-500 group-hover:scale-[1.01]"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl">
                              <p className="text-white font-bold px-6 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/50">Change Image</p>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center space-y-4 p-12">
                            <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <p className="text-xl font-bold text-foreground">Change image</p>
                            <p className="text-muted-foreground text-sm">Drag and drop or click here.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </Dropzone>
                <p className="text-xs text-muted-foreground mt-4 italic">
                  {file ? 'New image selected.' : 'Current image will be preserved unless you upload a new one.'}
                </p>
              </div>
            </div>

            {/* Content Area */}
            <div className="space-y-6">
              <div className='pb-2 border-b border-border/50'>
                <FormLabel className="text-lg font-extrabold text-foreground font-heading">Content Editor</FormLabel>
                <p className="text-sm text-muted-foreground">Everything you write is auto-saved locally.</p>
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
                          disabled={isSubmitting}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="pt-8 border-t border-border/50 flex justify-end">
              <Button
                type="submit"
                size="lg"
                className="px-12 py-7 rounded-2xl text-lg font-bold bg-purple-600 hover:bg-purple-700 shadow-xl shadow-purple-600/20"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Updating...
                  </>
                ) : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default EditBlog;