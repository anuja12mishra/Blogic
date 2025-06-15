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
export function AppSidebar() {
    return (
        <Sidebar>
            <SidebarHeader className='items-center'>
                <img src={logo} alt="logo-image" width={50} className="bg-transparent"/>
            </SidebarHeader>
            <SidebarContent >
                <SidebarGroup>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton>
                                <IoHomeOutline />
                                <Link to="">Home</Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton>
                                <BiCategoryAlt />
                                <Link to={RouteCategoryDetails}>Categories</Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton>
                                <TbLogs/>
                                <Link to={RouteBlog}>Blogs</Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton>
                                <FaRegUser/>
                                <Link to="">User</Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton>
                                <LiaComments />
                                <Link to="">Comments</Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>Categories</SidebarGroupLabel>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton>
                                <GoDot />
                                <Link to="">categories</Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter />
        </Sidebar>
    )
}
