import { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import Avatar from './Avatar';
import Dropdown from './Dropdown';
import Badge from './Badge';
import Button from './Button';

const Header = ({
  logo,
  navigation,
  actions,
  userMenu,
  notifications,
  showSearch = true,
  className = '',
  ...props
}) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Default user menu items
  const defaultUserMenu = [
    { label: 'Profile', icon: 'fa-user', href: '/profile' },
    { label: 'Settings', icon: 'fa-cog', href: '/settings' },
    { divider: true },
    {
      label: 'Logout',
      icon: 'fa-sign-out-alt',
      onClick: () => logout(),
      className: 'text-red-600 dark:text-red-400'
    }
  ];

  return (
    <header
      className={`
        bg-white dark:bg-gray-800
        border-b border-gray-200 dark:border-gray-700
        ${className}
      `}
      {...props}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            {typeof logo === 'string' ? (
              <Link to="/">
                <img
                  src={logo}
                  alt="Logo"
                  className="h-8 w-auto"
                />
              </Link>
            ) : (
              logo
            )}
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-4">
            {navigation?.map((item, index) => (
              <Link
                key={index}
                to={item.href}
                className={`
                  px-3 py-2 rounded-md text-sm font-medium
                  ${item.current
                    ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                    : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
                  }
                `}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right section */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            {showSearch && (
              <div className="hidden md:block">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="
                      w-64 pl-10 pr-4 py-2
                      border border-gray-300 dark:border-gray-600
                      rounded-lg
                      bg-gray-50 dark:bg-gray-700
                      text-gray-900 dark:text-white
                      focus:outline-none focus:ring-2 focus:ring-primary-500
                    "
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <i className="fas fa-search text-gray-400" />
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            {actions && (
              <div className="hidden md:flex items-center space-x-2">
                {actions}
              </div>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
            >
              <i className={`fas ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}`} />
            </button>

            {/* Notifications */}
            {notifications && (
              <Dropdown
                trigger={
                  <button className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700">
                    <i className="fas fa-bell" />
                    {notifications.unread > 0 && (
                      <Badge
                        variant="danger"
                        className="absolute top-0 right-0 -mt-1 -mr-1"
                      >
                        {notifications.unread}
                      </Badge>
                    )}
                  </button>
                }
                items={notifications.items}
                width="w-80"
              />
            )}

            {/* User Menu */}
            {user && (
              <Dropdown
                trigger={
                  <button className="flex items-center space-x-2">
                    <Avatar
                      src={user.avatar}
                      alt={user.name}
                      size="sm"
                    />
                    <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-200">
                      {user.name}
                    </span>
                  </button>
                }
                items={userMenu || defaultUserMenu}
                align="right"
              />
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
            >
              <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-2">
            {showSearch && (
              <div className="px-2 pb-3 pt-2">
                <input
                  type="text"
                  placeholder="Search..."
                  className="
                    w-full px-4 py-2
                    border border-gray-300 dark:border-gray-600
                    rounded-lg
                    bg-gray-50 dark:bg-gray-700
                    text-gray-900 dark:text-white
                    focus:outline-none focus:ring-2 focus:ring-primary-500
                  "
                />
              </div>
            )}
            <nav className="px-2 pt-2 pb-3 space-y-1">
              {navigation?.map((item, index) => (
                <Link
                  key={index}
                  to={item.href}
                  className={`
                    block px-3 py-2 rounded-md text-base font-medium
                    ${item.current
                      ? 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
                      : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
                    }
                  `}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            {actions && (
              <div className="px-5 pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
                {actions}
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

Header.propTypes = {
  logo: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  navigation: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      href: PropTypes.string.isRequired,
      current: PropTypes.bool
    })
  ),
  actions: PropTypes.node,
  userMenu: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      icon: PropTypes.string,
      href: PropTypes.string,
      onClick: PropTypes.func,
      divider: PropTypes.bool,
      className: PropTypes.string
    })
  ),
  notifications: PropTypes.shape({
    unread: PropTypes.number,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        message: PropTypes.string,
        time: PropTypes.string,
        read: PropTypes.bool,
        onClick: PropTypes.func
      })
    )
  }),
  showSearch: PropTypes.bool,
  className: PropTypes.string
};

export default Header;