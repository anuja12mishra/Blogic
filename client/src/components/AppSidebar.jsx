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
import logo from '@/assets/logo.png'
import { IoHomeOutline } from "react-icons/io5";
import { BiCategoryAlt } from "react-icons/bi";
import { TbLogs } from "react-icons/tb";
import { FaRegUser } from "react-icons/fa";
import { LiaComments } from "react-icons/lia";
import { GoDot } from "react-icons/go";
import { RouteAddCategory, RouteBlog, RouteCategoryDetails } from "@/helpers/RouteName";
import { useFetch } from "@/hooks/useFetch";
import { getEnv } from "@/helpers/getEnv";
export function AppSidebar() {

    // Pass refresh as a dependency to trigger re-fetch
    const { data: categoriesdata, loading, error } = useFetch(
        `${getEnv('VITE_API_URL')}/api/category/get-all-category`,
        { method: 'GET', credentials: 'include' },
    );

    // console.log('categoriesdata',categoriesdata);
    const categories = categoriesdata?.categories || [];

    return (
        // <Sidebar className="bg-gradient-to-r from-purple-500 via-purple-400 via-purple-300 to-white text-white border-none">
        <Sidebar>
            <SidebarHeader className='items-center'>
                <img src={logo} alt="logo-image" width={50} className="bg-transparent" />
            </SidebarHeader>
            <SidebarContent >
                <SidebarGroup>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <Link to="">
                                <SidebarMenuButton className='hover:bg-purple-300'>
                                    <IoHomeOutline />
                                    Home
                                </SidebarMenuButton>
                            </Link>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <Link to={RouteCategoryDetails}>
                                <SidebarMenuButton className='hover:bg-purple-300'>
                                    <BiCategoryAlt />
                                    Categories
                                </SidebarMenuButton>
                            </Link>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <Link to={RouteBlog}>
                                <SidebarMenuButton className='hover:bg-purple-300'>
                                    <TbLogs />
                                    Blogs
                                </SidebarMenuButton>
                            </Link>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <Link to="">
                                <SidebarMenuButton className='hover:bg-purple-300'>
                                    <FaRegUser />
                                    User
                                </SidebarMenuButton>
                            </Link>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <Link to="">
                                <SidebarMenuButton className='hover:bg-purple-300'>
                                    <LiaComments />
                                    Comments
                                </SidebarMenuButton>
                            </Link>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>Categories</SidebarGroupLabel>
                    <SidebarMenu >
                        {
                            categories.length > 0 ?
                                categories?.map((category, index) => {
                                    return (
                                        <SidebarMenuItem key={index}>
                                            <Link to="">
                                                <SidebarMenuButton className='hover:bg-purple-300'>
                                                    <GoDot />
                                                    {category.name}
                                                </SidebarMenuButton>
                                            </Link>
                                        </SidebarMenuItem>
                                    )
                                }) : <SidebarGroupLabel>No category found</SidebarGroupLabel>
                        }

                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter />
        </Sidebar>
    )
}
