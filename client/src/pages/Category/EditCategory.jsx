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
import { RouteCategoryDetails } from '@/helpers/RouteName';
import { useFetch } from '@/hooks/useFetch';

const formSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  slug: z.string().min(3, 'Slug must be at least 3 characters long'),
});

function EditCategory() {
  const navigate = useNavigate();
  const { category_id } = useParams();
  // console.log(category_id);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Form setup
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      slug: '',
    },
  });

  const { data: categoryData, loading, error } = useFetch(
    `${getEnv('VITE_API_URL')}/api/category/get-a-category/${category_id}`,
    { method: 'GET', credentials: 'include' }
  );
  // console.log(categoryData.category);

  // Auto-generate slug from name
  const watchedName = form.watch('name');

  // Set fetched values
  useEffect(() => {
    if (categoryData?.category) {
      form.setValue('name', categoryData.category.name);
      form.setValue('slug', categoryData.category.slug);
    }
  }, [categoryData]);

  // Auto-generate slug only when user types in name
  useEffect(() => {
    if (watchedName) {
      const slug = slugify(watchedName, {
        lower: true,
        strict: true,
        trim: true,
      });
      form.setValue('slug', slug);
    }
  }, [watchedName, form]);


  async function onSubmit(values) {
    if (isSubmitting) return; // Prevent double submission

    setIsSubmitting(true);

    try {
      const res = await fetch(`${getEnv('VITE_API_URL')}/api/category/edit/${category_id}`, {
        method: 'PUT',
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

      // Success case
      const successMessage = data.message || 'Category added successfully!';
      showtoast('success', successMessage);

      // Reset form after successful submission
      form.reset();
      navigate(RouteCategoryDetails);

    } catch (err) {
      console.error('Request failed:', err);
      showtoast('error', 'Network error: Unable to connect to server');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Card className='max-w-screen-md mx-auto'>
        <CardHeader>
          <h1 className='text-xl text-center border-b-2 pb-2 border-gray-300'>
            Edit a Category
          </h1>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter the category name"
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
                          placeholder="Auto-generated from name"
                          disabled={isSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                      <p className="text-sm text-gray-500">
                        The slug is automatically generated from the category name
                      </p>
                    </FormItem>
                  )}
                />

                <div className="flex gap-4">
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Adding Category...' : 'Add Category'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => form.reset()}
                    disabled={isSubmitting}
                  >
                    Clear Form
                  </Button>
                </div>

                {/* Optional: Link to view categories */}
                <div className="text-center">
                  <Button asChild>
                    <Link
                      to={RouteCategoryDetails}

                    >
                      View All Categories
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

export default EditCategory;
