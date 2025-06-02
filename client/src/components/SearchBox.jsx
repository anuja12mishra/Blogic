import React from 'react'
import { Input } from './ui/input'

function SearchBox() {
  return (
    <form>
        <Input placeholder='serach here...' className='h-9 rounded-full border-purple-900 border-2'/>
    </form>
  )
}

export default SearchBox;