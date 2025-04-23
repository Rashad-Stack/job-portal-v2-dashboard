import React, { useEffect, useState } from 'react';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import { Outlet } from 'react-router-dom';
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
      <div className=" bg-gray-100 w-full h-screen">
        <DashboardNavbar toggleSidebar={toggleSidebar} />
        {isSidebarOpen && <DashboardSidebar toggleSidebar={toggleSidebar} />}
        <main>
          <div className="p-6 sm:ml-64 mt-14">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
}

export default DashboardLayout;
