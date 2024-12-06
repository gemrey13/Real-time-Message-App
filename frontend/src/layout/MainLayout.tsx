import React from "react";
import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { DashboardHeader } from "@/pages/Dashboard/DashboardHeader";

const MainLayout = () => {
    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "350px",
                } as React.CSSProperties
            }>
            <AppSidebar />
            <SidebarInset>
               <DashboardHeader/>
                <Outlet />
            </SidebarInset>
        </SidebarProvider>
    );
};

export default MainLayout;
