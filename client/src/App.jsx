import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Button } from "./components/ui/button"
import Layout from "./Layouts/Layout"
import {
  RouteAddBlog,
  RouteAddCategory,
  RouteBlog,
  RouteBlogByCategory,
  RouteCategoryDetails,
  RouteComment,
  RouteEditBlog,
  RouteEditCategory,
  RouteIndex,
  RouteProfile,
  RouteSearch,
  RouteSignIn,
  RouteSignUp,
  RouteSingleBlogDetails,
  RouteUser
} from "./helpers/RouteName"
import Index from "./pages/index.jsx"
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import AddCategory from "./pages/Category/AddCategory";
import CategoryDetails from "./pages/Category/CategoryDetails";
import EditCategory from "./pages/Category/EditCategory";
import AddBlog from "./pages/Blog/AddBlog";
import EditBlog from "./pages/Blog/EditBlog";
import BlogDetails from "./pages/Blog/BlogDetails";
import SingleBlogDetails from "./pages/Blog/SingleBlogDetails";
import BlogByCategory from "./pages/Blog/BlogByCategory";
import SerachResult from "./pages/SerachResult";
import CommentDashboard from "./pages/CommentDashboard";
import UsersDashboard from "./pages/UsersDashboard";
import AuthRouteProtection from "./components/Protected Routes/AuthRouteProtection";
import OnlyAdminAllowed from "./components/Protected Routes/OnlyAdminAllowed";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={RouteIndex} element={<Layout />}>
          <Route index element={<Index />}></Route>
          {/* Blog routes */}
          <Route path={RouteSingleBlogDetails()} element={<SingleBlogDetails />}></Route>
          <Route path={RouteBlogByCategory()} element={<BlogByCategory />}></Route>
          {/* Search routes */}
          <Route path={RouteSearch()} element={<SerachResult />}></Route>

          <Route element={<AuthRouteProtection />}>
            <Route path={RouteProfile} element={<Profile />}></Route>

            {/* Blog routes */}
            <Route path={RouteAddBlog} element={<AddBlog />}></Route>
            <Route path={RouteBlog} element={<BlogDetails />}></Route>
            <Route path={RouteEditBlog()} element={<EditBlog />}></Route>
            {/* comments page */}
            <Route path={RouteComment} element={<CommentDashboard />}></Route>

          </Route>

          <Route element={<OnlyAdminAllowed/>}>
            <Route path={RouteProfile} element={<Profile />}></Route>

            {/* Blog routes */}
            <Route path={RouteAddBlog} element={<AddBlog />}></Route>
            <Route path={RouteBlog} element={<BlogDetails />}></Route>
            <Route path={RouteEditBlog()} element={<EditBlog />}></Route>
            {/* comments page */}
            <Route path={RouteComment} element={<CommentDashboard />}></Route>

            {/* Category routes */}
            <Route path={RouteAddCategory} element={<AddCategory />}></Route>
            <Route path={RouteCategoryDetails} element={<CategoryDetails />}></Route>
            <Route path={RouteEditCategory()} element={<EditCategory />}></Route>
            {/* users page */}
            <Route path={RouteUser} element={<UsersDashboard />}></Route>
          </Route>

        </Route>
        <Route element={<SignIn />} path={RouteSignIn} />
        <Route element={<SignUp />} path={RouteSignUp} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
