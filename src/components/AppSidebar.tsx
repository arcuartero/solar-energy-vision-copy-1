import { LayoutGrid, BarChart3, Coins, Folder, FileText, ChevronLeft, ExternalLink } from "lucide-react";
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
  { title: "Overview", url: "/", icon: LayoutGrid },
  { title: "Consumption", url: "/consumption", icon: BarChart3 },
  { title: "Costs", url: "/costs", icon: Coins },
  { title: "Payments", url: "/payments", icon: Folder },
  { title: "Contract details", url: "/contract-details", icon: FileText },
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
                    activeClassName="bg-orange-50 text-orange-600 font-medium"
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    {open && <span className="text-sm">{item.title}</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </div>

        {/* Energy Wallet at bottom */}
        <div className="px-2 pb-4 space-y-3">
          <a
            href="https://energywallet.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 py-3 px-3 rounded-lg text-orange-600 font-medium hover:bg-orange-50 transition-colors"
          >
            <img src={logo} alt="EnergyWallet" className="h-5 w-5 flex-shrink-0" />
            {open && (
              <>
                <span className="text-sm flex-1">Save energy</span>
                <ExternalLink className="h-4 w-4" />
              </>
            )}
          </a>
          
          {/* Collapse button */}
          {open && (
            <SidebarTrigger className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-2">
              <ChevronLeft className="h-5 w-5" />
              <span>Collapse sidebar</span>
            </SidebarTrigger>
          )}
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
