import { AppSidebar } from '@/components/AppSidebar';
import Footer from '@/components/Footer';
import Topbar from '@/components/Topbar';
import { SidebarProvider } from '@/components/ui/sidebar';
import React from 'react';
import { Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <SidebarProvider>
            {/* top-bar */}
            <Topbar />
            {/* side-bar */}
            <AppSidebar />
            <main className='w-full'>
                {/* content */}
                <div className='w-full min-h-[calc(100vh-45px)] pt-22 px-10 pb-12'>
                    <Outlet />
                </div>
                {/* footer */}
                <Footer />
            </main>
        </SidebarProvider>
    )
}

export default Layout;