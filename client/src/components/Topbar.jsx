import React from 'react'
import { Button } from './ui/button'
import { Link, useNavigate } from 'react-router-dom'
import { PiSignOutBold } from "react-icons/pi";
import SearchBox from './SearchBox';
import { 
  RouteAddBlog, 
  RouteIndex, 
  RouteProfile, 
  RouteSignIn,
  RouteComment,
  RouteLike,
  RouteBlog,
  RouteCategoryDetails,
  RouteUser
} from '@/helpers/RouteName';
import { useDispatch, useSelector } from 'react-redux';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FaRegUser } from "react-icons/fa";
import { MdLogout, MdOutlineDashboard } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import { IoHomeOutline } from "react-icons/io5";
import { LiaComments } from "react-icons/lia";
import { TbFileLike, TbLogs } from "react-icons/tb";
import { BiCategoryAlt } from "react-icons/bi";
import { removeUser } from '@/redux/user/user.slice';
import { showtoast } from '@/helpers/showtoast';
import { getEnv } from '@/helpers/getEnv';
import { ModeToggle } from './ModeToggle';

function Topbar() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      const res = await fetch(`${getEnv('VITE_API_URL')}/api/auth/logout`, {
        method: 'GET',
        credentials: 'include',
      });

      let data = {};
      try {
        data = await res.json();
      } catch (err) {
        data = { message: 'Logged out' };
      }

      if (!res.ok) {
        const errorMessage = data.message || `Server error: ${res.status}`;
        showtoast('error', errorMessage);
        return;
      }

      dispatch(removeUser());
      const successMessage = data.message || 'Logout successful!';
      showtoast('success', successMessage);
      navigate(RouteIndex, { replace: true });

    } catch (err) {
      showtoast('error', 'Network error: Unable to connect to server');
    }
  };

  return (
    <div className="flex justify-between items-center gap-2 w-[calc(100%-2rem)] max-w-7xl fixed top-4 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-md h-16 z-50 px-5 md:px-10 rounded-full border border-border shadow-lg">
      <div className="flex justify-center items-center gap-4">
        <Link to={RouteIndex} className="hover:opacity-80 transition-opacity">
          <h1 className="flex text-lg sm:text-xl md:text-2xl font-bold text-foreground">
            b<span className='text-purple-600 font-extrabold'>L</span>ogic
          </h1>
        </Link>
        
        <div className="hidden md:flex items-center gap-1">
           <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center gap-2 text-muted-foreground hover:text-purple-600">
                <MdOutlineDashboard size={20} />
                <span className="font-medium">Dashboard</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 mt-2">
              <DropdownMenuLabel>Menu</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to={RouteIndex} className="flex items-center gap-2">
                  <IoHomeOutline /> Home
                </Link>
              </DropdownMenuItem>
              
              {user && user.isLoggedIn && (
                <>
                  <DropdownMenuItem asChild>
                    <Link to={RouteComment} className="flex items-center gap-2">
                      <LiaComments /> Comments
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to={RouteLike} className="flex items-center gap-2">
                      <TbFileLike /> Likes
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to={RouteBlog} className="flex items-center gap-2">
                      <TbLogs /> Blogs
                    </Link>
                  </DropdownMenuItem>
                </>
              )}

              {user && user.user?.role === 'admin' && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Admin</DropdownMenuLabel>
                  <DropdownMenuItem asChild>
                    <Link to={RouteCategoryDetails} className="flex items-center gap-2">
                      <BiCategoryAlt /> Categories
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to={RouteUser} className="flex items-center gap-2">
                      <FaRegUser /> Users
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex-1 max-w-md px-4">
        <SearchBox />
      </div>


      <div className="flex items-center gap-2 md:gap-4">
        <div className="hidden sm:block">
          <ModeToggle />
        </div>
        
        {
          !user.isLoggedIn ?
            <Button asChild className="rounded-full px-6">
              <Link to={RouteSignIn}>
                <PiSignOutBold className="mr-2 hidden md:block" />
                Sign in
              </Link>
            </Button>
            :
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <Avatar className="h-10 w-10 border-2 border-purple-100 hover:border-purple-300 transition-colors">
                  <AvatarImage
                    className="object-cover"
                    src={user.user.avatar}
                    alt={user.user.name}
                  />
                  <AvatarFallback className="bg-purple-50 text-purple-700">
                    {(user?.user?.name || "")
                      .trim()
                      .split(/\s+/)
                      .filter(Boolean)
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 mt-2">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to={RouteProfile} className="flex items-center gap-2">
                    <FaRegUser className="text-muted-foreground" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to={RouteAddBlog} className="flex items-center gap-2">
                    <FaPlus className="text-muted-foreground" />
                    Create Blog
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500">
                  <MdLogout className="mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        }
      </div>
    </div>
  )
}

export default Topbar
