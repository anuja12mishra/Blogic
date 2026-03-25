import { RouteSignIn } from '@/helpers/RouteName';
import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import { RootState } from '@/store'

const OnlyAdminAllowed: React.FC = () => {
    const user = useSelector((state: RootState) => state.user);
    if (user && user.isLoggedIn && user.user.role === 'admin') {
        return (
            <Outlet />
        )
    } else {
        return <Navigate to={RouteSignIn}/> 
    }
}

export default OnlyAdminAllowed;
