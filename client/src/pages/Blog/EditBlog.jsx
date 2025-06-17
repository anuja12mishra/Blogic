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
  const [initialContent, setInitialContent] = useState('');

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

  console.log

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

      setInitialContent(blogContent);
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

      console.log(
        'title', values.title.trim(),
        'category', values.category,
        'slug', values.slug,
        'blogContent', values.blogcontent.trim
      )

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
    return <div className="container mx-auto p-4">Loading blog data...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Card className='max-w-screen-md mx-auto'>
        <CardHeader>
          <h1 className='text-2xl font-bold text-left border-b-2 pb-2 border-gray-300'>
            Edit Blog Post
          </h1>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className='bg-white'>
                        {categoriesData?.categories?.length > 0 ? (
                          categoriesData.categories.map((category) => (
                            <SelectItem key={category._id} value={category._id}>
                              {category.name}
                            </SelectItem>
                          ))
                        ) : (
                          <div className="px-2 py-1.5 text-sm text-gray-500">
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
                  </FormItem>
                )}
              />

              <div>
                <FormLabel className='mb-2 block'>Featured Image</FormLabel>
                <Dropzone
                  onDrop={handleFileUpload}
                  accept={{
                    'image/*': ['.jpeg', '.jpg', '.png', '.webp']
                  }}
                  maxFiles={1}
                  disabled={isSubmitting}
                >
                  {({ getRootProps, getInputProps, isDragActive }) => (
                    <div {...getRootProps()}>
                      <input {...getInputProps()} />
                      <div className={`flex justify-center items-center w-full lg:w-72 h-56 border-2 border-dashed rounded cursor-pointer transition-colors ${isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                        }`}>
                        {avatar ? (
                          <img
                            src={typeof avatar === 'string' ? avatar : URL.createObjectURL(avatar)}
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
                <p className="text-sm text-gray-500 mt-1">
                  {file ? 'New image selected' : 'Current image will be kept if no new image is selected'}
                </p>
              </div>

              <FormField
                control={form.control}
                name="blogcontent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Blog Content</FormLabel>
                    <FormControl>
                      <div className="w-full max-w-full min-h-[300px] overflow-hidden rounded border border-gray-300">
                        <Editor
                          onChange={field.onChange}
                          value={field.value}
                          // initialData={field.value|| initialContent}
                          props={{ initialData: decode(field.value) }}
                          disabled={isSubmitting}
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
                  {isSubmitting ? 'Updating...' : 'Update Blog'}
                </Button>
              </div>

              <div className="text-center">
                <Button asChild variant="outline">
                  <Link to={RouteBlog}>
                    Back to All Blogs
                  </Link>
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default EditBlog;