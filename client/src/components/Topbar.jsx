import React, { useEffect } from 'react'
import { Button } from './ui/button'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { PiSignOutBold } from "react-icons/pi";
import SearchBox from './SearchBox';
import { RouteAddBlog, RouteIndex, RouteProfile, RouteSignIn } from '@/helpers/RouteName';
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
import { MdLogout } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import { removeUser } from '@/redux/user/user.slice';
import { showtoast } from '@/helpers/showtoast';
import { getEnv } from '@/helpers/getEnv';
import { IoMenu } from "react-icons/io5";
import { useSidebar } from './ui/sidebar';

function Topbar() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { toggleSidebar } = useSidebar(false);

  

  const handleLogout = async () => {
    try {
      const res = await fetch(`${getEnv('VITE_API_URL')}/api/auth/logout`, {
        method: 'GET',
        credentials: 'include',
      });

      let data = {};
      try {
        // Attempt to parse JSON only if response body exists
        data = await res.json();
      } catch (err) {
        // If parsing fails (e.g., empty body), default to fallback
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
      //navigate(RouteIndex);
      navigate(RouteIndex, { replace: true });

    } catch (err) {
      showtoast('error', 'Network error: Unable to connect to server');
    }
  };



  const handleMenuClick = () => {
    if (toggleSidebar) {
      toggleSidebar();
    }
  };


  return (
    <div className="flex justify-between items-center gap-2 w-full fixed bg-white h-16 z-20 px-5 md:px-16 lg:px-20 border-b-2 border-gray-200">
      <div className="flex justify-center items-center gap-2">
        <button onClick={handleMenuClick}>
          <IoMenu size={25} />
        </button>
        <Link to={RouteIndex}>
          <h1 className="flex text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold bg-black bg-clip-text">
            b<p className='text-purple-600 font-extrabold'>L</p>ogic
          </h1>
        </Link>
        {/* <img src={name} className='h-72 w-72 object object-cover'/>  */}
      </div>

      <div className="w-40 sm:w-60 md:w-80 lg:w-[400px]">
        <SearchBox />
      </div>


      <div className="flex items-center">
        {
          !user.isLoggedIn ?
            <Button asChild>
              <Link to={RouteSignIn}>
                <PiSignOutBold className="mr-1 hidden md:block" />
                Sign up
              </Link>
            </Button>
            :
            <DropdownMenu className='bg-amber-700'>
              <DropdownMenuTrigger>
                <Avatar className="inline-block h-10 w-10 rounded-full overflow-hidden border-2 border-gray-200">
                  <AvatarImage
                    className="h-full w-full object-cover"
                    src={user.user.avatar}
                    alt={user.user.name}
                  />
                  <AvatarFallback className="bg-gray-300 text-sm text-gray-700 flex items-center justify-center h-full w-full">
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
              <DropdownMenuContent>
                <DropdownMenuLabel>
                  <p className='text-lg'>{user.user.name}</p>
                  <p className="text-sm ">{user.user.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to={RouteProfile}>
                    <FaRegUser />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to={RouteAddBlog}>
                    <FaPlus />
                    Create Blog
                  </Link>
                </DropdownMenuItem>
                {/* <DropdownMenuItem>Subscription</DropdownMenuItem> */}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <MdLogout color='red' />
                  Logout
                  {/* <Button onClick={handleLogout} className="w-full">
                    <MdLogout color='red' />
                    Logout
                  </Button> */}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        }

      </div>
    </div>

  )
}

export default Topbar