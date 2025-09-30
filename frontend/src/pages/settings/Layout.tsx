import { Link, Outlet, useLocation } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/general/Sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React from "react";

const Layout = () => {
  return (
    <SidebarProvider>
      <div className="w-full min-h-screen gap-2">
        <AppSidebar />
        <div className="rounded-full absolute  w-[90%] px-8 py-2 top-4 left-1/2 -translate-x-1/2 bg-secondary h-12 flex md:hidden items-center justify-between text-foreground z-10">
          <SidebarTrigger size="lg" />

          <div className="flex gap-1 items-center">
            <img
              src="/reelato-light.svg"
              className="h-4 w-4 md:h-6 md:w-6"
              alt="Reelato Logo"
            />
            <h1 className="text-center font-semibold text-md md:text-xl text-foreground">
              Reelato
            </h1>
          </div>
        </div>

        <div className="w-full h-screen p-6 pt-22 md:pt-4 md:pl-72">
          <LayoutBreadcrumb />
          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  );
};

const LayoutBreadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <Breadcrumb className="pb-4 pl-8 border-b  mb-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          <Link to="/">Home</Link>
        </BreadcrumbItem>
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;

          return (
            <React.Fragment key={to}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>
                    {capitalizeFirstLetter(value)}
                  </BreadcrumbPage>
                ) : (
                  <Link to={to}>{capitalizeFirstLetter(value)}</Link>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default Layout;
