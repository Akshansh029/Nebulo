import { SidebarProvider } from "@/components/ui/sidebar";
import { UserButton } from "@clerk/nextjs";
import React from "react";
import AppSidebar from "./AppSidebar";

type Props = {
  children: React.ReactNode;
};

const SidebarLayout = ({ children }: Props) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="m-2 flex w-full flex-col gap-4">
        <div className="border-sidebar-border bg-sidebar flex items-center gap-2 rounded-md border p-2 px-4 shadow">
          {/* <SearchBar /> */}
          <div className="ml-auto"></div>
          <UserButton />
        </div>
        {/* main content */}
        <div className="border-sidebar-border bg-sidebar min-h-[calc(100vh-6rem)] overflow-y-scroll rounded-md border p-4 shadow">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
};

export default SidebarLayout;
