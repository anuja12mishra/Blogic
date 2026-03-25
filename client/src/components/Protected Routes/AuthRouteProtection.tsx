import { RouteSignIn } from '@/helpers/RouteName';
import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import { RootState } from '@/store'

const AuthRouteProtection: React.FC = () => {
    const user = useSelector((state: RootState) => state.user);
    if (user && user.isLoggedIn) {
        return (
            <Outlet />
        )
    } else {
        return <Navigate to={RouteSignIn}/> 
    }
}

export default AuthRouteProtection;
