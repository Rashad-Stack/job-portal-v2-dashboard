import React, { useEffect, useState } from "react";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import { Outlet } from "react-router";
import DashboardNavbar from "../components/dashboard/DashboardNavbar";
import useDeviceSize from "../hooks/useDeviceSize";

function DashboardLayout() {
  const isMobile = useDeviceSize();
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  function toggleSidebar() {
    setSidebarOpen(!isSidebarOpen);
  }

  return (
    <>
      <div className="w-full">
        <DashboardNavbar toggleSidebar={toggleSidebar} />
        {isSidebarOpen && <DashboardSidebar toggleSidebar={toggleSidebar} />}
        <main>
          <div className="sm:p-0 md:p-1 lg:p-4 flex justify-center items-center dark:bg-gray-900">
            <div className="lg:ml-46 md:ml-48 sm:ml-64 mt-14 mx-w-[100%] w-[100%]">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default DashboardLayout;
