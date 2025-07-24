"use client";

import * as React from "react";
import {
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
  LayoutDashboard,
  CreditCard,
  Users,
  ShieldPlus,
  Building2,
  UserCog,
  User,
  MonitorCog,
  
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { TeamSwitcher } from "../navHeader/admin-switcher";
import { NavUser } from "../navFooter/admin-user";
import NavMain from "../navItems/admin-nav-main";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],

  dashbooard: [
    {
      title: "Dashboard",
      url: "/admin-dashboard",
      icon: LayoutDashboard,
      isActive: true,
    },
  ],
  postContent: [
    {
      title: "Companies",
      url: "companies",
      icon: ShieldPlus,
      isActive: true,
    },
    {
      title: "Workspaces",
      url: "workspaces",
      icon: Building2,
      isActive: true,
    },
     {
      title: "Users",
      url: "users",
      icon: Users,
      isActive: true,
    },
     {
      title: "Roles",
      url: "roles",
      icon: UserCog,
      isActive: true,
    },
    {
      title: "Payment Plans",
      url: "paymentplans",
      icon: CreditCard,
      isActive: true,
    },
     {
      title: "Social Media Accounts",
      url: "admin-social-accounts",
      icon: User,
      isActive: true,
    },
    {
      title: "Configuration",
      url: "configurations",
      icon: MonitorCog,
      isActive: true,
    },
  ],
 
};

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.dashbooard} />
        <NavMain items={data.postContent} subHeading={"Post Content"} />
        
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
