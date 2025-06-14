import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { RouteAddCategory } from '@/helpers/RouteName'
import React from 'react'
import { Link } from 'react-router-dom'

function CategoryDetails() {
  return (
    <div>
        <Card>
            <CardHeader>
                <Button asChild>
                    <Link to={RouteAddCategory}>
                    Add Category
                    </Link>
                
                </Button>
            </CardHeader>
            <CardContent>
            </CardContent>
        </Card>
    </div>
  )
}

export default CategoryDetails