import Footer from '@/components/Footer';
import Topbar from '@/components/Topbar';
import CategoryBar from '@/components/CategoryBar';
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';

const Layout: React.FC = () => {
    const location = useLocation();
    
    // Routes where we want a focused writing/admin experience without the category bar
    const hideCategoryBarRoutes = ['/blog/add', '/category/add', '/profile', '/blogs', '/comments', '/likes', '/users'];
    const isEditRoute = location.pathname.includes('/edit/');
    const shouldHideCategoryBar = hideCategoryBarRoutes.includes(location.pathname) || isEditRoute;

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* top-bar */}
            <Topbar />
            
            {/* category-bar (conditionally rendered) */}
            {!shouldHideCategoryBar && (
                <div className="mt-20">
                    <CategoryBar />
                </div>
            )}
            
            <main className={`flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pb-12 transition-all duration-300 ${
                shouldHideCategoryBar ? 'pt-24' : 'pt-8'
            }`}>
                {/* content */}
                <div className="container mx-auto min-h-[calc(100vh-200px)]">
                    <Outlet />
                </div>
            </main>
            {/* footer */}
            <Footer />
        </div>
    )
}

export default Layout;
