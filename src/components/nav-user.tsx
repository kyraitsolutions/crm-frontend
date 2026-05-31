import {
  // IconCreditCard,
  IconLogout,
} from "@tabler/icons-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  // DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { CookieUtils } from "@/utils/cookie-storage.utils";
import { useNavigate } from "react-router-dom";

interface NavUserProps {
  collapsed: boolean;
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}

export function NavUser({ collapsed, user }: NavUserProps) {
  const { isMobile } = useSidebar();
  const navigate = useNavigate();
  const logoutHandler = () => {
    CookieUtils.clear();
    navigate("/login");
  };


  console.log(user)
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="hover:bg-transparent! cursor-pointer"
            >
              <Avatar className="h-8 w-8 rounded-full">
                <AvatarImage src={user.avatar} alt={user.name?.charAt(0)} className="" />
                <AvatarFallback className="rounded capitalize">
                  {user.name ? user.name?.charAt(0) : user.email.charAt(0) || ""}
                </AvatarFallback>
              </Avatar>
              {!collapsed && <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium capitalize text-white/70">{user?.name ? user?.name : user.email?.split('@gmail.com')}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {user.email}
                </span>
              </div>}
              {/* <IconDotsVertical className="ml-auto size-4" /> */}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-full">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg capitalize bg-second font-medium text-white">
                    {user.name ? user.name?.charAt(0) : user.email.charAt(0) || ""}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium capitalize">{user?.name ? user?.name : user.email?.split('@gmail.com')}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {/* <DropdownMenuGroup>
              <DropdownMenuItem>
                <IconUserCircle />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconCreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconNotification />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup> */}
            {/* <DropdownMenuSeparator /> */}
            <DropdownMenuItem onClick={logoutHandler}>
              <IconLogout />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
