// import { RouteSignIn } from '@/helpers/RouteName';
// import React, { useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { Navigate, Outlet } from 'react-router-dom';
// import Cookies from 'js-cookie';
// import { removeUser } from '../../redux/user/user.slice'; 
// function OnlyAdminAllowed() {
//   const user = useSelector((state) => state.user);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     const accessToken = Cookies.get('access_token');
//     if (!accessToken && user?.isLoggedIn) {
//       dispatch(removeUser()); // Clear user from Redux if token is missing
//     }
//   }, [user, dispatch]);

//   if (user && user.isLoggedIn && user.user.role ==='admin') {
//     return <Outlet />;
//   } else {
//     return <Navigate to={RouteSignIn} />;
//   }
// }

// export default OnlyAdminAllowed;


import { RouteIndex, RouteSignIn } from '@/helpers/RouteName';
import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
function OnlyAdminAllowed() {
    const user = useSelector((state) => state.user);
    if (user && user.isLoggedIn && user.user.role ==='admin') {
        return (
            <Outlet />
        )
    }else{
        return <Navigate to={RouteSignIn}/> 
    }
}

export default OnlyAdminAllowed