import React, { useEffect, useState } from 'react';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import { Outlet } from 'react-router';
import DashboardNavbar from '../components/dashboard/DashboardNavbar';
import useDeviceSize from '../hooks/useDeviceSize';

function DashboardLayout() {
  const isMobile = useDeviceSize();
  // console.log(isMobile);
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
          <div className="p-6 sm:ml-64 mt-14  dark:bg-gray-900">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
}

export default DashboardLayout;
