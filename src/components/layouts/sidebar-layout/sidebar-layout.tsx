import { RootLayout } from "@/components/layouts/root-layout";
import type { ReactNode } from "react";
import { HeaderSidebarLayout } from "@/components/layouts/sidebar-layout/header-sidebar-layout";
import { Sidebar } from "@/components/layouts/sidebar-layout/sidebar"

interface props {
  children: ReactNode;
}

export const SidebarLayout = ({ children }: props) => {

  return (
    <RootLayout>
      <div className="flex flex-col w-full mobile-page-padding">
        <HeaderSidebarLayout />
        <div>
          {children}
        </div>
        <Sidebar />
      </div>
    </RootLayout>
  );
};
