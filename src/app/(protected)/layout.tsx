import { SidebarProvider } from "@/components/ui/sidebar";
import { UserButton } from "@clerk/nextjs";
import React from "react";
import AppSidebar from "./AppSidebar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

type Props = {
  children: React.ReactNode;
};

const SidebarLayout = ({ children }: Props) => {
  return (
    <SidebarProvider className="h-screen">
      <AppSidebar />
      <main className="m-2 flex w-full flex-col gap-4">
        <div className="border-sidebar-border bg-sidebar flex items-center gap-2 rounded-md border p-2 px-8 shadow">
          <div className="ml-auto"></div>
          <div className="flex items-center justify-center gap-10">
            <Link href="/create" className="group w-full">
              <Button
                variant="outline"
                className="flex w-full cursor-pointer items-center gap-2"
              >
                <Plus className="transform transition-transform duration-300 group-hover:rotate-90" />
                <span>Create Project</span>
              </Button>
            </Link>
            <UserButton />
          </div>
        </div>
        {/* main content */}
        <div className="border-sidebar-border bg-sidebar min-h-[calc(100vh-5.5rem)] overflow-y-scroll rounded-md border p-4 shadow">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
};

export default SidebarLayout;
