import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Link } from "react-router-dom"
import { IoHomeOutline } from "react-icons/io5";
import { BiCategoryAlt } from "react-icons/bi";
import { TbLogs } from "react-icons/tb";
import { FaRegUser } from "react-icons/fa";
import { LiaComments } from "react-icons/lia";
import { TbFileLike } from "react-icons/tb";
import { GoDot } from "react-icons/go";
import {
    RouteBlog,
    RouteBlogByCategory,
    RouteCategoryDetails,
    RouteComment,
    RouteIndex,
    RouteLike,
    RouteUser
} from "@/helpers/RouteName";
import { useFetch } from "@/hooks/useFetch";
import { getEnv } from "@/helpers/getEnv";
import { useSelector } from "react-redux";
import { Ellipsis } from 'lucide-react';
export function AppSidebar() {
    const user = useSelector((state => state.user));
    // Pass refresh as a dependency to trigger re-fetch
    const { data: categoriesdata, loading, error } = useFetch(
        `${getEnv('VITE_API_URL')}/api/category/get-all-category`,
        { method: 'GET', credentials: 'include' },
    );

    // console.log('categoriesdata',categoriesdata);
    const categories = categoriesdata?.categories || [];
    return (
        // <Sidebar className="bg-gradient-to-r from-purple-500 via-purple-400 via-purple-300 to-white text-white border-none">
        <Sidebar className='pt-16 border-purple-200 min-h-max' >
            <SidebarHeader className='text-2xl font-bold text-purple-600 items-start pt-5'>
                <h2>Control Panel</h2>
            </SidebarHeader>
            <SidebarContent >
                <SidebarGroup>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <Link to={RouteIndex}>
                                <SidebarMenuButton className='hover:bg-purple-500 hover:text-white'>
                                    <IoHomeOutline />
                                    Home
                                </SidebarMenuButton>
                            </Link>
                        </SidebarMenuItem>
                        {
                            user && user.isLoggedIn ? (
                                <>
                                    <SidebarMenuItem>
                                        <Link to={RouteComment}>
                                            <SidebarMenuButton className='hover:bg-purple-500 hover:text-white'>
                                                <LiaComments />
                                                Comments
                                            </SidebarMenuButton>
                                        </Link>
                                    </SidebarMenuItem>
                                    <SidebarMenuItem>
                                        <Link to={RouteLike}>
                                            <SidebarMenuButton className='hover:bg-purple-500 hover:text-white'>
                                                <TbFileLike />
                                                Likes
                                            </SidebarMenuButton>
                                        </Link>
                                    </SidebarMenuItem>
                                    <SidebarMenuItem>
                                        <Link to={RouteBlog}>
                                            <SidebarMenuButton className='hover:bg-purple-500 hover:text-white'>
                                                <TbLogs />
                                                Blogs
                                            </SidebarMenuButton>
                                        </Link>
                                    </SidebarMenuItem>
                                </>
                            ) : <></>
                        }
                        {

                            user && user.user.role === 'admin' ? (
                                <>
                                    <SidebarMenuItem>
                                        <Link to={RouteCategoryDetails}>
                                            <SidebarMenuButton className='hover:bg-purple-500 hover:text-white'>
                                                <BiCategoryAlt />
                                                Categories
                                            </SidebarMenuButton>
                                        </Link>
                                    </SidebarMenuItem>
                                    <SidebarMenuItem>
                                        <Link to={RouteUser}>
                                            <SidebarMenuButton className='hover:bg-purple-500 hover:text-white'>
                                                <FaRegUser />
                                                User
                                            </SidebarMenuButton>
                                        </Link>
                                    </SidebarMenuItem>
                                </>
                            ) : <></>
                        }
                    </SidebarMenu>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>Categories</SidebarGroupLabel>
                    <SidebarMenu >
                        {
                            loading ?
                                <div className="flex w-full h-full justify-center items-center text-primary">
                                    <div className="animate-spin">
                                        <Ellipsis size={64} />
                                    </div>
                                </div>

                                :
                                (categories.length > 0 ?
                                    categories?.map((category, index) => {
                                        return (
                                            <SidebarMenuItem key={index}>
                                                <Link to={RouteBlogByCategory(category.slug)}>
                                                    <SidebarMenuButton className='hover:bg-purple-500 hover:text-white'>
                                                        <GoDot />
                                                        {category.name}
                                                    </SidebarMenuButton>
                                                </Link>
                                            </SidebarMenuItem>
                                        )
                                    }) : <SidebarGroupLabel>No category found</SidebarGroupLabel>)
                        }

                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter />
        </Sidebar>
    )
}
