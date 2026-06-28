import { useLocation, Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useUIStore, useAuthStore } from '../store';
import { useEffect } from 'react';

export default function Layout() {
  const { sidebarOpen } = useUIStore();
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <div className="flex">
        {isAuthenticated && <Sidebar />}
        <main
          className={`flex-1 min-h-[calc(100vh-4rem)] transition-all duration-300 ${
            isAuthenticated
              ? sidebarOpen
                ? 'lg:pl-64'
                : 'lg:pl-0'
              : ''
          }`}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
