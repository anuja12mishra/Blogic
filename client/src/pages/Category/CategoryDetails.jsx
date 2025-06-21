import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { RouteAddCategory, RouteEditCategory, RouteSignIn } from '@/helpers/RouteName'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useFetch } from '@/hooks/useFetch'
import { showtoast } from '@/helpers/showtoast'
import { getEnv } from '@/helpers/getEnv'
import Loading from '@/components/Loading'
import { MdDeleteOutline } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { handleCategoryDelete } from '@/helpers/handleCategoryDelete'
import { useSelector } from 'react-redux'

function CategoryDetails() {
  const user = useSelector((state) => state.user)
  const [refresh, setRefresh] = useState(false);

  // Pass refresh as a dependency to trigger re-fetch
  const { data: categoriesdata, loading, error } = useFetch(
    `${getEnv('VITE_API_URL')}/api/category/get-all-category`,
    { method: 'GET', credentials: 'include' },
    [refresh] // Add refresh as dependency
  );

  const handleDelete = async (id) => {
    try {
      const deleteres = await handleCategoryDelete(
        `${getEnv('VITE_API_URL')}/api/category/delete/${id}`
      );

      if (deleteres && deleteres.success) {
        showtoast('success', deleteres.message);
        setRefresh(prev => !prev);
      } else {
        showtoast('error', deleteres?.message || 'Failed to delete category');
      }
    } catch (error) {
      console.error('Delete error:', error);
      showtoast('error', 'An error occurred while deleting the category');
    }
  };

  // Handle error state
  if (error) {
    return (
      <div className="flex justify-center items-center">
        <Card>
          <CardContent className="p-6">
            <p className="text-red-600">Error loading categories: {error.message}</p>
            <Button
              onClick={() => setRefresh(prev => !prev)}
              className="mt-4"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return <Loading />
  }

  const categories = categoriesdata?.categories || [];

  return (
    <div>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Categories</h2>
            {
              user?.isLoggedIn ? (
                <Button asChild>
                  <Link to={RouteAddCategory}>
                    Add Blog
                  </Link>
                </Button>
              ) : (
                <Link to={RouteSignIn}>
                  <Button>
                    Sign-In To Add Category
                  </Button>
                </Link>
              )
            }
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>
              {categories.length > 0
                ? `A list of ${categories.length} categories.`
                : "No categories found."
              }
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.length > 0 ? (
                categories.map((category) => (
                  <TableRow key={category._id}>
                    <TableCell className="font-medium">
                      {category.name}
                    </TableCell>
                    <TableCell>
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                        {category.slug}
                      </code>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          aria-label={`Edit ${category.name}`}
                        >
                          <Link to={RouteEditCategory(category._id)}>
                            <FaRegEdit size={16} />
                            <span className="sr-only">Edit {category.name}</span>
                          </Link>
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(category._id)}
                          aria-label={`Delete ${category.name}`}
                          className='hover:cursor-pointer'
                        >
                          <MdDeleteOutline size={16} />
                          <span className="sr-only">Delete {category.name}</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-lg">No categories found</p>
                      <Button asChild variant="outline">
                        <Link to={RouteAddCategory}>
                          Create your first category
                        </Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default CategoryDetails