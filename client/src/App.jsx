import { BrowserRouter, Routes, Route } from "react-router-dom"; 
import { Button } from "./components/ui/button"
import Layout from "./Layouts/Layout"
import { RouteAddBlog, RouteAddCategory, RouteBlog, RouteCategoryDetails, RouteEditBlog, RouteEditCategory, RouteIndex, RouteProfile, RouteSignIn, RouteSignUp } from "./helpers/RouteName"
import Index from "./pages"
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import AddCategory from "./pages/Category/AddCategory";
import CategoryDetails from "./pages/Category/CategoryDetails";
import EditCategory from "./pages/Category/EditCategory";
import AddBlog from "./pages/Blog/AddBlog";
import EditBlog from "./pages/Blog/EditBlog";
import BlogDetails from "./pages/Blog/BlogDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={RouteIndex} element={<Layout />}>
          <Route index element={<Index />}></Route>
          <Route path={RouteProfile} element={<Profile />}></Route>
          {/* Category routes */}
          <Route path={RouteAddCategory} element={<AddCategory />}></Route>
          <Route path={RouteCategoryDetails} element={<CategoryDetails />}></Route>
          <Route path={RouteEditCategory()} element={<EditCategory />}></Route>
          {/* Blog routes */}
          <Route path={RouteAddBlog} element={<AddBlog />}></Route>
          <Route path={RouteBlog} element={<BlogDetails />}></Route>
          <Route path={RouteEditBlog()} element={<EditBlog />}></Route>
        </Route>
        <Route element={<SignIn />} path={RouteSignIn}/>
        <Route element={<SignUp />} path={RouteSignUp}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
