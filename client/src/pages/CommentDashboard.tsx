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
import { MdDeleteOutline, MdOutlineRemoveRedEye } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { RouteSingleBlogDetails } from '@/helpers/RouteName'
import { handleCategoryDelete } from '@/helpers/handleCategoryDelete'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import moment from 'moment'

function CommentDashboard() {
  const user = useSelector((state: RootState) => state.user)
  const [refresh, setRefresh] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Pass refresh as a dependency to trigger re-fetch
  const { data: CommentData, loading, error } = useFetch<{comment: any[]}>(
    `${getEnv('VITE_API_URL')}/api/comment/protected-all-comments`,
    { method: 'GET', credentials: 'include' },
    [refresh] 
  );
  //console.log('CommentData',CommentData)
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
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

  const handleEdit = async (commentId: string) => {
    if (!editValue.trim()) return;
    setIsUpdating(true);
    try {
      const res = await fetch(`${getEnv('VITE_API_URL')}/api/comment/update/${commentId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ comment: editValue })
      });
      const data = await res.json();
      if (res.ok) {
        showtoast('success', 'Comment updated successfully');
        setEditingCommentId(null);
        setRefresh(prev => !prev);
      } else {
        showtoast('error', data.message || 'Failed to update');
      }
    } catch (error) {
      showtoast('error', 'An error occurred while updating');
    } finally {
      setIsUpdating(false);
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
      <Card>
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
                comments.map((comment: any) => (
                  <TableRow key={comment._id}>
                    <TableCell className="font-medium">
                      {comment.blogId?.title}
                    </TableCell>
                    <TableCell>
                      {comment.authorId?.name}
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
                        <Link to={RouteSingleBlogDetails(comment.blogId?.category?.slug, comment.blogId?.slug, comment.blogId?._id)}>
                          <Button size="sm" variant="outline" className='hover:cursor-pointer'>
                            <MdOutlineRemoveRedEye size={16} />
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          onClick={() => {
                            setEditingCommentId(comment._id);
                            setEditValue(comment.comment);
                          }}
                          className='hover:cursor-pointer'
                        >
                          <FaRegEdit size={16} />
                        </Button>
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

      {/* Edit Modal/Dialog */}
      {editingCommentId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <h3 className="text-xl font-bold">Edit Comment</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <textarea
                className="w-full p-3 border rounded-md min-h-[100px] bg-background text-foreground"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                placeholder="Edit your comment..."
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditingCommentId(null)}>Cancel</Button>
                <Button disabled={isUpdating} onClick={() => handleEdit(editingCommentId)}>
                  {isUpdating ? 'Updating...' : 'Update Comment'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

export default CommentDashboard