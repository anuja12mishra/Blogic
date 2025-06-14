export const RouteIndex = '/'
export const RouteSignIn = "/sign-in"
export const RouteSignUp = "/sign-up"
export const RouteProfile = "/profile"
export const RouteCategoryDetails = '/categories'
export const RouteAddCategory = '/category/add'
export const RouteEditCategory = (category_id)=>{
    if(category_id) return `/category/edit/${category_id}`
    else return '/category/edit/:category_id'
}