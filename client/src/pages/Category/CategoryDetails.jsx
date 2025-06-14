import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { RouteAddCategory, RouteEditCategory } from '@/helpers/RouteName'
import React, { useEffect } from 'react'
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
function CategoryDetails() {

  const { data: categoriesdata, loading, error } = useFetch(
    `${getEnv('VITE_API_URL')}/api/category/get-all-category`,
    { method: 'GET', credentials: 'include' }
  );
  //console.log(categoriesdata?.categories)

  if (loading) {
    return <Loading />
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <div>
            <Button>
              <Link to={RouteAddCategory}>
                Add Category
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>A list of Categories.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categoriesdata && categoriesdata.categories?.length > 0 ? (
                categoriesdata?.categories.map((category, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell>{category.slug}</TableCell>
                    <TableCell>
                      <div className='flex gap-6'>
                        <Button className=" bg-red-700 hover:bg-red-600 hover:text-black">
                          <MdDeleteOutline size={24} className='cursor-pointer' />
                        </Button>
                        <Button className="bg-white  text-black hover:text-white">
                          <Link to={RouteEditCategory(category._id)}>
                            <FaRegEdit size={22} className='cursor-pointer' />
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className='text-center text-2xl'>No data found.</TableCell>
                </TableRow>
              )}

              {/* <TableCell className="font-medium">INV001</TableCell>
                <TableCell>Paid</TableCell>
                <TableCell>Credit Card</TableCell> */}
            </TableBody>
          </Table>

        </CardContent>
      </Card>
    </div>
  )
}

export default CategoryDetails