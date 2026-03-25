export const RouteIndex = '/'
export const RouteSignIn = "/sign-in"
export const RouteSignUp = "/sign-up"
export const RouteProfile = "/profile"

// Category route endpoint
export const RouteCategoryDetails = '/categories'
export const RouteAddCategory = '/category/add'
export const RouteEditCategory = (category_id?: string) => {
    if (category_id) return `/category/edit/${category_id}`
    else return '/category/edit/:category_id'
}


// Blog route endpoint
export const RouteBlog = '/blogs'
export const RouteAddBlog = '/blog/add'
export const RouteEditBlog = (blog_id?: string) => {
    if (blog_id) return `/blog/edit/${blog_id}`
    else return '/blog/edit/:blog_id'
}
export const RouteSingleBlogDetails = (category?: string, slug?: string, blog_id?: string) => {
    if (!category || !slug) {
        return '/blog/:category/:slug/:blog_id'
    } else {
        return `/blog/${category}/${slug}/${blog_id}`
    }
}
export const RouteBlogByCategory = (category?: string) => {
    if (!category) {
        return '/blog/:category'
    } else {
        return `/blog/${category}`
    }
}
export const RouteSearch = (q?: string) => {
    if (q) {
        return `/search?q=${q}`
    }
    return '/search'
}

export const RouteComment = '/comments'
export const RouteLike = '/likes'

export const RouteUser = '/users'
export const RoutePublicProfile = (username?: string) => {
    if (username) return `/u/${username}`
    else return '/u/:username'
}