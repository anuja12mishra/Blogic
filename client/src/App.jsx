import { BrowserRouter, Routes, Route } from "react-router-dom"; 
import { Button } from "./components/ui/button"
import Layout from "./Layouts/Layout"
import { RouteIndex, RouteProfile, RouteSignIn, RouteSignUp } from "./helpers/RouteName"
import Index from "./pages"
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={RouteIndex} element={<Layout />}>
          <Route index element={<Index />}></Route>
          <Route path={RouteProfile} element={<Profile />}></Route>
        </Route>
        <Route element={<SignIn />} path={RouteSignIn}/>
        <Route element={<SignUp />} path={RouteSignUp}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
