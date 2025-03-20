import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { NAV_ITEMS } from '../../utils/constants';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-primary-700 dark:bg-gray-800 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-center h-16 px-4 bg-primary-800 dark:bg-gray-900">
          <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
        </div>

        <nav className="mt-5 px-2">
          {NAV_ITEMS.ADMIN.map((item) => (
            <a
              key={item.path}
              href={item.path}
              onClick={(e) => {
                e.preventDefault();
                navigate(item.path);
              }}
              className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                location.pathname === item.path
                  ? 'bg-primary-800 text-white dark:bg-gray-900'
                  : 'text-primary-100 hover:bg-primary-600 dark:hover:bg-gray-700'
              }`}
            >
              <i className={`fas fa-${item.icon} mr-4 h-6 w-6`}></i>
              {item.name}
            </a>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64 flex flex-col">
        {/* Top Navigation */}
        <div className="sticky top-0 z-20 flex-shrink-0 flex h-16 bg-white dark:bg-gray-800 shadow">
          <button
            className="lg:hidden px-4 text-gray-500 dark:text-gray-200 focus:outline-none"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <i className={`fas fa-${sidebarOpen ? 'times' : 'bars'} h-6 w-6`}></i>
          </button>

          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex items-center">
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                {NAV_ITEMS.ADMIN.find((item) => item.path === location.pathname)?.name || 'Dashboard'}
              </h1>
            </div>

            <div className="ml-4 flex items-center md:ml-6">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-1 rounded-full text-gray-500 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
              >
                <i className={`fas fa-${theme === 'dark' ? 'sun' : 'moon'} h-6 w-6`}></i>
              </button>

              {/* Profile Dropdown */}
              <div className="ml-3 relative">
                <div className="flex items-center">
                  <button
                    onClick={handleLogout}
                    className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 dark:bg-gray-700 dark:hover:bg-gray-600 focus:outline-none"
                  >
                    <i className="fas fa-sign-out-alt mr-2"></i>
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {/* Page content will be rendered here */}
              <Outlet />
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default AdminLayout;