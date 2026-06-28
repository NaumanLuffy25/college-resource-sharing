import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Search,
  Upload,
  FileText,
  Bookmark,
  Trophy,
  Clock,
  Users,
  BarChart3,
  X,
} from 'lucide-react';
import { useAuthStore, useUIStore } from '../store';

interface NavItem {
  to: string;
  label: string;
  icon: React.ElementType;
}

const mainNav: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/browse', label: 'Browse Resources', icon: Search },
  { to: '/upload', label: 'Upload Resource', icon: Upload },
  { to: '/my-resources', label: 'My Resources', icon: FileText },
  { to: '/bookmarks', label: 'Bookmarks', icon: Bookmark },
  { to: '/leaderboard', label: 'Leaderboard', icon: Trophy },
];

const adminNav: NavItem[] = [
  { to: '/admin/pending', label: 'Pending Approvals', icon: Clock },
  { to: '/admin/users', label: 'User Management', icon: Users },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
];

function SidebarLink({ to, label, icon: Icon }: NavItem) {
  const location = useLocation();
  const isActive =
    to === '/dashboard'
      ? location.pathname === '/dashboard'
      : location.pathname.startsWith(to);

  return (
    <NavLink
      to={to}
      className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
        isActive
          ? 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800/50 dark:hover:text-gray-200'
      }`}
    >
      <Icon
        className={`w-[18px] h-[18px] shrink-0 transition-colors ${
          isActive
            ? 'text-blue-600 dark:text-blue-400'
            : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'
        }`}
      />
      {label}
      {isActive && (
        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
      )}
    </NavLink>
  );
}

export default function Sidebar() {
  const { user } = useAuthStore();
  const { sidebarOpen, mobileMenuOpen, closeMobileMenu } = useUIStore();
  const isAdmin = user?.role === 'admin' || user?.role === 'moderator';

  const sidebarContent = (
    <div className="flex h-full flex-col bg-white border-r border-gray-200 dark:bg-gray-950 dark:border-gray-800">
      <div className="flex items-center justify-between h-16 px-5 border-b border-gray-100 dark:border-gray-800 lg:hidden">
        <span className="text-lg font-bold text-gray-900 dark:text-white">Menu</span>
        <button
          onClick={closeMobileMenu}
          className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="mb-4">
          <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
            Navigation
          </p>
          <div className="space-y-0.5">
            {mainNav.map((item) => (
              <SidebarLink key={item.to} {...item} />
            ))}
          </div>
        </div>

        {isAdmin && (
          <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
            <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              Administration
            </p>
            <div className="space-y-0.5">
              {adminNav.map((item) => (
                <SidebarLink key={item.to} {...item} />
              ))}
            </div>
          </div>
        )}
      </nav>

      <div className="border-t border-gray-100 dark:border-gray-800 p-3">
        <div className="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 p-4 dark:from-blue-500/5 dark:to-indigo-500/5">
          <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
            Share your knowledge
          </p>
          <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">
            Upload resources and help fellow students succeed.
          </p>
          <NavLink
            to="/upload"
            onClick={closeMobileMenu}
            className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm shadow-blue-500/25"
          >
            <Upload className="w-3.5 h-3.5" />
            Upload Now
          </NavLink>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside
        className={`hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:top-16 lg:z-30 transition-all duration-300 ${
          sidebarOpen ? 'lg:translate-x-0' : 'lg:-translate-x-full lg:w-0 lg:overflow-hidden'
        }`}
      >
        {sidebarContent}
      </aside>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
            onClick={closeMobileMenu}
          />
          <aside className="absolute inset-y-0 left-0 w-72 transform transition-transform duration-300 ease-out">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
