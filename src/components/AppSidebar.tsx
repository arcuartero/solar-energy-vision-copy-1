import { LayoutGrid, BarChart3, PieChart, Folder, FileText, ChevronRight } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import logo from "@/assets/logo.svg";

import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Dashboard", url: "/", icon: LayoutGrid },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Reports", url: "/reports", icon: PieChart },
  { title: "Files", url: "/files", icon: Folder },
  { title: "Documents", url: "/documents", icon: FileText },
];

export function AppSidebar() {
  const { open } = useSidebar();

  return (
    <Sidebar className="border-r border-border" collapsible="icon">
      <SidebarContent className="flex flex-col h-full">
        {/* Logo at top */}
        <div className="p-4 flex items-center justify-center">
          <img src={logo} alt="Logo" className="h-12 w-12" />
        </div>

        {/* Menu items */}
        <div className="flex-1 px-2">
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild tooltip={item.title}>
                  <NavLink
                    to={item.url}
                    end
                    className="flex items-center gap-3 py-3 px-3 rounded-lg text-muted-foreground hover:bg-orange-50 hover:text-orange-600 transition-colors"
                    activeClassName="bg-orange-50 text-orange-600"
                  >
                    <item.icon className="h-5 w-5" />
                    {open && <span className="text-sm">{item.title}</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </div>

        {/* Toggle button at bottom */}
        <div className="p-4 border-t border-border">
          <SidebarTrigger className="w-full flex items-center justify-center hover:bg-muted rounded-lg p-2">
            <ChevronRight className="h-5 w-5" />
          </SidebarTrigger>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
