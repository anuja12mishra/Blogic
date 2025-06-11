import React from 'react'
import name from '@/assets/name.png'
import { Button } from './ui/button'
import { Link } from 'react-router-dom'
import { PiSignOutBold } from "react-icons/pi";
import { Input } from './ui/input';
import SearchBox from './SearchBox';
import { RouteSignIn } from '@/helpers/RouteName';
function Topbar() {
  return (
    <div className="flex justify-between items-center gap-2 w-full fixed bg-white h-16 z-20 px-10 md:px-15 lg:px-20 border-b-2 border-gray-200">
      <div className="flex items-center">
        <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-700 text-transparent bg-clip-text">
          BLogic
        </h1>
      </div>

      <div className="w-[500px]">
        <SearchBox />
      </div>


      <div className="flex items-center">
        <Button asChild>
          <Link to={RouteSignIn}>
            <PiSignOutBold className="mr-1" />
            Sign up
          </Link>
        </Button>
      </div>
    </div>

  )
}

export default Topbar