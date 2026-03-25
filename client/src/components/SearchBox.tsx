import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Input } from './ui/input';
import { useNavigate } from 'react-router-dom';
import { RouteSearch } from '@/helpers/RouteName';

const SearchBox: React.FC = () => {
    const [query, setQuery] = useState<string>('');
    const navigate = useNavigate();

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(RouteSearch(query.trim()));
        }
        setQuery('');
    };

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
    );
};

export default SearchBox;