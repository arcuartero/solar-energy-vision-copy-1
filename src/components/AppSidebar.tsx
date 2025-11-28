import { LayoutGrid, BarChart3, Coins, Folder, FileText, ChevronLeft, ExternalLink } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import enovoLogo from "@/assets/enovo-logo.svg";
import saveEnergyLogo from "@/assets/save-energy-logo.png";
import energyCloudLogo from "@/assets/energy-cloud-logo.png";

import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems: Array<{
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }> | string;
  isImage?: boolean;
}> = [
  { title: "Overview", url: "/overview", icon: LayoutGrid },
  { title: "Consumption", url: "/consumption", icon: BarChart3 },
  { title: "Costs", url: "/costs", icon: Coins },
  { title: "Payments", url: "/payments", icon: Folder },
  { title: "Contract details", url: "/contract-details", icon: FileText },
  { title: "Energy Cloud", url: "/", icon: energyCloudLogo, isImage: true },
];

export function AppSidebar() {
  const { open } = useSidebar();

  return (
    <Sidebar className="border-r border-border w-72" collapsible="icon">
      <SidebarContent className="flex flex-col h-full">
        {/* Logo at top */}
        <div className="p-6 flex items-center justify-start">
          <img src={enovoLogo} alt="Enovo" className="h-16 w-auto" />
        </div>

        {/* Menu items */}
        <div className="flex-1 px-4">
          <SidebarMenu className="space-y-4">
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild tooltip={item.title}>
                  <NavLink
                    to={item.url}
                    end
                    className="flex items-center gap-3 py-5 px-5 rounded-lg text-muted-foreground hover:bg-orange-50 hover:text-orange-600 transition-colors text-base"
                    activeClassName="bg-orange-50 text-orange-600 font-medium"
                  >
                    {item.isImage ? (
                      <img src={item.icon as string} alt={item.title} className="h-6 w-6 flex-shrink-0" />
                    ) : (
                      <item.icon className="h-6 w-6 flex-shrink-0" />
                    )}
                    {open && <span className="text-base">{item.title}</span>}
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
            <img src={saveEnergyLogo} alt="Save Energy" className="h-8 w-8 flex-shrink-0 rounded-full" />
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
