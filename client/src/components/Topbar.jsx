import React from 'react'
import name from '@/assets/name.png'
import { Button } from './ui/button'
import { Link } from 'react-router-dom'
import { PiSignOutBold } from "react-icons/pi";
import { Input } from './ui/input';
import SearchBox from './SearchBox';
function Topbar() {
  return (
    <div className='flex justify-between gap-2.5 items-center w-full fixed bg-white h-16 z-20 px-10'>
      <div className='pt-3.5'>
        <img src={name} alt="logo-image" width={150} className="bg-transparent"/>
      </div>
      <div className='w-[500px]'>
        <SearchBox />
      </div>
      <div>
        <Button asChild>
          <Link to='/'>
            <PiSignOutBold/> 
            Sign up
          </Link>
          
        </Button>
      </div>
    </div>
  )
}

export default Topbar