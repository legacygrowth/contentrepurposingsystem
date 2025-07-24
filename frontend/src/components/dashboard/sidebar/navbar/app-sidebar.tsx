"use client";

import * as React from "react";
import {
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
  LayoutDashboard,
  FilePlus,
  CalendarIcon,
  Image,
  Users,
  Plug,
  User,
  Settings,
  LifeBuoy,
  CreditCard,
  Key,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { TeamSwitcher } from "../navHeader/team-switcher";
import { NavUser } from "../navFooter/nav-user";
import NavMain from "../navItems/nav-main";

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
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true,
    },
  ],
  postContent: [
    {
      title: "Post",
      url: "create-post",
      icon: FilePlus,
      isActive: true,
    },
    {
      title: "Calendar",
      url: "calendar",
      icon: CalendarIcon,
      isActive: true,
    },
  ],
  mediaLibrary: [
    {
      title: "Media Library",
      url: "media-library",
      icon: Image,
      isActive: true,
    },
  ],
  integrations: [
    {
      title: "Social Media Accounts",
      url: "social-media-accounts",
      icon: Users,
      isActive: true,
    },
    {
      title: "Third-Party Integrations",
      url: "third-party-integrations",
      icon: Plug,
      isActive: true,
    },
  ],
  members: [
    {
      title: "Members",
      url: "members",
      icon: Users,
      isActive: true,
    },
  ],
  account: [
    {
      title: "Team",
      url: "team",
      icon: User,
      isActive: true,
    },
    {
      title: "Settings",
      url: "settings",
      icon: Settings,
      isActive: true,
    },
    {
      title: "API Key",
      url: "Apikey",
      icon: Key,
      isActive: true,
    },
    {
      title: "Subscription",
      url: "subscription",
      icon: CreditCard,
      isActive: true,
    },
    {
      title: "Help",
      url: "help",
      icon: LifeBuoy,
      isActive: true,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.dashbooard} />
        <NavMain items={data.postContent} subHeading={"Post Content"} />
        <NavMain items={data.mediaLibrary} subHeading={"Media"} />
        <NavMain items={data.integrations} subHeading={"Integrations"} />
        <NavMain items={data.members} subHeading={"Members"} />
        <NavMain items={data.account} subHeading={"Account"} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
