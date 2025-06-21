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
import moment from 'moment'

function CommentDashboard() {
  const user = useSelector((state) => state.user)
  const [refresh, setRefresh] = useState(false);

  // Pass refresh as a dependency to trigger re-fetch
  const { data: CommentData, loading, error } = useFetch(
    `${getEnv('VITE_API_URL')}/api/comment/protected-all-comments`,
    { method: 'GET', credentials: 'include' },
    [refresh] 
  );
  // console.log('categoriesdata',categoriesdata)
  const handleDelete = async (id) => {
    try {
      const deleteres = await handleCategoryDelete(
        `${getEnv('VITE_API_URL')}/api/comment/delete/${id}`
      );

      if (deleteres && deleteres.success) {
        showtoast('success', deleteres.message);
        setRefresh(prev => !prev);
      } else {
        showtoast('error', deleteres?.message || 'Failed to delete Comment');
      }
    } catch (error) {
      console.error('Delete error:', error);
      showtoast('error', 'An error occurred while deleting the Comment');
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

  const comments = CommentData?.comment || [];

  return (
    <div>
      <Card className='md:w-6xl'>
        <CardHeader>
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Comments</h2>
          </div>
        </CardHeader>
        <CardContent>
          <Table >
            <TableCaption>
              {comments.length > 0
                ? `A list of ${comments.length} Comments.`
                : "No Comments found."
              }
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Blog</TableHead>
                <TableHead>Comment By</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Comment</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comments && comments.length > 0 ? (
                comments.map((comment) => (
                  <TableRow key={comment._id}>
                    <TableCell className="font-medium">
                      {comment.blogId.title}
                    </TableCell>
                    <TableCell>
                      {comment.authorId.name}
                    </TableCell>
                    <TableCell className='w-fit'>
                      {moment(comment.createdAt).format('LLLL')}
                    </TableCell>
                    <TableCell >
                      <p className='overflow-hidden text-clip'>
                        {comment.comment}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(comment._id)}
                          aria-label={`Delete ${comment.comment}`}
                          className='hover:cursor-pointer'
                        >
                          <MdDeleteOutline size={16} />
                          <span className="sr-only">Delete {comment.comment}</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <></>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default CommentDashboard






// [
//     {
//         "_id": "68569047f7845e2b866220bd",
//         "authorId": {
//             "_id": "6849a2f55acf922667e9fee4",
//             "name": "Anuj Mishra admin"
//         },
//         "blogId": {
//             "_id": "68568870d5ec0d5f4ec282ea",
//             "title": "in the"
//         },
//         "comment": "greate",
//         "createdAt": "2025-06-21T10:58:15.657Z",
//         "updatedAt": "2025-06-21T10:58:15.657Z",
//         "__v": 0
//     },
//     {
//         "_id": "6856903df7845e2b866220b9",
//         "authorId": {
//             "_id": "6849a2f55acf922667e9fee4",
//             "name": "Anuj Mishra admin"
//         },
//         "blogId": {
//             "_id": "68568870d5ec0d5f4ec282ea",
//             "title": "in the"
//         },
//         "comment": "gjehf",
//         "createdAt": "2025-06-21T10:58:05.143Z",
//         "updatedAt": "2025-06-21T10:58:05.143Z",
//         "__v": 0
//     }
// ]