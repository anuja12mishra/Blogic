import { RouteIndex, RouteSignIn } from '@/helpers/RouteName';
import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
function AuthRouteProtection() {
    const user = useSelector((state) => state.user);
    if (user && user.isLoggedIn) {
        return (
            <Outlet />
        )
    }else{
        return <Navigate to={RouteSignIn}/> 
    }
}

export default AuthRouteProtection