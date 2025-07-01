import React, { useState } from 'react'
import { Input } from './ui/input'
import { useNavigate } from 'react-router-dom'
import { RouteSearch } from '@/helpers/RouteName'


function SearchBox() {
    const [query, setQuery] = useState('')
    const navigate = useNavigate()
    
    const handleInputChange = (e) => {
        setQuery(e.target.value)
    }
    
    const handleSubmit = (e) => {
        e.preventDefault()
        if (query.trim()) { // Only navigate if there's a query
            navigate(RouteSearch(query.trim()))
        }
        setQuery('');
    }
    
    return (
        <form onSubmit={handleSubmit}>
            <Input 
                name='q' 
                value={query}
                onChange={handleInputChange} 
                placeholder='Search here...' 
                className='h-9 rounded-full border-purple-600 border-2'
            />
        </form>
    )
}

export default SearchBox