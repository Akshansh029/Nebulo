"use client";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
  Bot,
  CreditCard,
  LayoutDashboard,
  Plus,
  Presentation,
  ShapesIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Q&A",
    url: "/qa",
    icon: Bot,
  },
  {
    title: "Meetings",
    url: "/meetings",
    icon: Presentation,
  },
  {
    title: "Billing",
    url: "/billing",
    icon: CreditCard,
  },
];

const projects = [
  {
    name: "Travelite",
  },
  {
    name: "Budgeteer",
  },
  {
    name: "Inventory",
  },
  {
    name: "CodeChime",
  },
];

const AppSidebar = () => {
  const pathname = usePathname();
  const { open } = useSidebar();
  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarHeader>
        <div
          className={cn(
            "flex items-center justify-center",
            open && "justify-start gap-2",
          )}
        >
          {/* <Image src="/logo.png" alt="logo" height={40} width={40} /> */}
          <ShapesIcon />
          {open && (
            <h1 className="text-2xl font-bold text-violet-500">Nebulo</h1>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="gap-0 p-2">
        <SidebarGroup className="px-0">
          <SidebarGroupLabel>Application</SidebarGroupLabel>
        </SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            {items.map((item) => {
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.url}
                      className={cn(
                        {
                          "!bg-primary !text-white": pathname === item.url,
                        },
                        "list-none",
                      )}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroupContent>

        <SidebarGroup className="px-0">
          <SidebarGroupLabel>Projects</SidebarGroupLabel>
        </SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            {projects.map((project) => {
              return (
                <SidebarMenuItem key={project.name}>
                  <SidebarMenuButton asChild>
                    <div className="">
                      <div
                        className={cn(
                          "text-primary flex size-6 items-center justify-center rounded-sm border bg-white text-sm",
                          {
                            "bg-primary text-white": true,
                            // "bg-primary text-white":
                            //   project.name === project.id,
                          },
                        )}
                      >
                        {project.name[0]}
                      </div>
                      <span>{project.name}</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
            {open && (
              <SidebarMenuItem>
                <Link href="/create-page">
                  <Button
                    variant="outline"
                    className="mt-2 w-full cursor-pointer"
                  >
                    <Plus />
                    <span>Create Project</span>
                  </Button>
                </Link>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
