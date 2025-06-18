import React from 'react'
import name from '@/assets/name.png'
import { Button } from './ui/button'
import { Link, useNavigate } from 'react-router-dom'
import { PiSignOutBold } from "react-icons/pi";
import { Input } from './ui/input';
import SearchBox from './SearchBox';
import { RouteIndex, RouteProfile, RouteSignIn } from '@/helpers/RouteName';
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
      navigate(RouteIndex);

    } catch (err) {
      showtoast('error', 'Network error: Unable to connect to server');
    }
  };


  return (
    <div className="flex justify-between items-center gap-2 w-full fixed bg-white h-16 z-20 px-5 md:px-16 lg:px-20 border-b-2 border-gray-200">
      <div className="flex items-center">
        <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-700 text-transparent bg-clip-text">
          BLogic
        </h1>
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
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar className=" md:w-10 md:h-10">
                  <AvatarImage className='object-cover' src={user.user.avatar} />
                  <AvatarFallback className="bg-gray-300">{(user.user.name)?.split(" ").map((n) => n[0]).join("").toUpperCase()}
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
                  <Link>
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