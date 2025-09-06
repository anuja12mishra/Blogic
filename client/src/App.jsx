import React, { Suspense, lazy } from "react";

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
  RouteLike,
  RouteProfile,
  RouteSearch,
  RouteSignIn,
  RouteSignUp,
  RouteSingleBlogDetails,
  RouteUser
} from "./helpers/RouteName"

import AuthRouteProtection from "./components/Protected Routes/AuthRouteProtection";
import OnlyAdminAllowed from "./components/Protected Routes/OnlyAdminAllowed";
import Loading from "./components/Loading";

const Index = lazy(() => import("./pages/index.jsx"));
const SignIn = lazy(() => import("./pages/SignIn"));
const SignUp = lazy(() => import("./pages/SignUp"));
const Profile = lazy(() => import("./pages/Profile"));

const AddCategory = lazy(() => import("./pages/Category/AddCategory"));
const CategoryDetails = lazy(() => import("./pages/Category/CategoryDetails"));
const EditCategory = lazy(() => import("./pages/Category/EditCategory"));

const AddBlog = lazy(() => import("./pages/Blog/AddBlog"));
const EditBlog = lazy(() => import("./pages/Blog/EditBlog"));
const BlogDetails = lazy(() => import("./pages/Blog/BlogDetails"));
const SingleBlogDetails = lazy(() => import("./pages/Blog/SingleBlogDetails"));
const BlogByCategory = lazy(() => import("./pages/Blog/BlogByCategory"));

const SerachResult = lazy(() => import("./pages/SerachResult"));
const CommentDashboard = lazy(() => import("./pages/CommentDashboard"));
const UsersDashboard = lazy(() => import("./pages/UsersDashboard"));
const LikeDashboard = lazy(() => import("./pages/LikeDashboard"));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="text-center mt-10"><Loading/></div>}>
        <Routes>
          <Route path={RouteIndex} element={<Layout />}>
            <Route index element={<Index />} />
            <Route path={RouteSingleBlogDetails()} element={<SingleBlogDetails />} />
            <Route path={RouteBlogByCategory()} element={<BlogByCategory />} />
            <Route path={RouteSearch()} element={<SerachResult />} />

            <Route element={<AuthRouteProtection />}>
              <Route path={RouteProfile} element={<Profile />} />
              <Route path={RouteAddBlog} element={<AddBlog />} />
              <Route path={RouteBlog} element={<BlogDetails />} />
              <Route path={RouteEditBlog()} element={<EditBlog />} />
              <Route path={RouteComment} element={<CommentDashboard />} />
              <Route path={RouteLike} element={<LikeDashboard />} />
            </Route>

            <Route element={<OnlyAdminAllowed />}>
              <Route path={RouteProfile} element={<Profile />} />
              <Route path={RouteAddBlog} element={<AddBlog />} />
              <Route path={RouteBlog} element={<BlogDetails />} />
              <Route path={RouteEditBlog()} element={<EditBlog />} />
              <Route path={RouteComment} element={<CommentDashboard />} />
              <Route path={RouteLike} element={<LikeDashboard />} />
              <Route path={RouteAddCategory} element={<AddCategory />} />
              <Route path={RouteCategoryDetails} element={<CategoryDetails />} />
              <Route path={RouteEditCategory()} element={<EditCategory />} />
              <Route path={RouteUser} element={<UsersDashboard />} />
            </Route>
          </Route>
          <Route path={RouteSignIn} element={<SignIn />} />
          <Route path={RouteSignUp} element={<SignUp />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}


// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path={RouteIndex} element={<Layout />}>
//           <Route index element={<Index />}></Route>
//           {/* Blog routes */}
//           <Route path={RouteSingleBlogDetails()} element={<SingleBlogDetails />}></Route>
//           <Route path={RouteBlogByCategory()} element={<BlogByCategory />}></Route>
//           {/* Search routes */}
//           <Route path={RouteSearch()} element={<SerachResult />}></Route>

//           <Route element={<AuthRouteProtection />}>
//             <Route path={RouteProfile} element={<Profile />}></Route>
//             {/* Blog routes */}
//             <Route path={RouteAddBlog} element={<AddBlog />}></Route>
//             <Route path={RouteBlog} element={<BlogDetails />}></Route>
//             <Route path={RouteEditBlog()} element={<EditBlog />}></Route>
//             {/* comments page */}
//             <Route path={RouteComment} element={<CommentDashboard />}></Route>
//             {/* like page */}
//             <Route path={RouteLike} element={<LikeDashboard />}></Route>
//           </Route>

//           <Route element={<OnlyAdminAllowed/>}>
//             <Route path={RouteProfile} element={<Profile />}></Route>

//             {/* Blog routes */}
//             <Route path={RouteAddBlog} element={<AddBlog />}></Route>
//             <Route path={RouteBlog} element={<BlogDetails />}></Route>
//             <Route path={RouteEditBlog()} element={<EditBlog />}></Route>
//             {/* comments page */}
//             <Route path={RouteComment} element={<CommentDashboard />}></Route>
//             {/* like page */}
//             <Route path={RouteLike} element={<LikeDashboard />}></Route>
//             {/* Category routes */}
//             <Route path={RouteAddCategory} element={<AddCategory />}></Route>
//             <Route path={RouteCategoryDetails} element={<CategoryDetails />}></Route>
//             <Route path={RouteEditCategory()} element={<EditCategory />}></Route>
//             {/* users page */}
//             <Route path={RouteUser} element={<UsersDashboard />}></Route>
//           </Route>

//         </Route>
//         <Route element={<SignIn />} path={RouteSignIn} />
//         <Route element={<SignUp />} path={RouteSignUp} />
//       </Routes>
//     </BrowserRouter>
//   )
// }

export default App
