import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useTheme } from '../../contexts/ThemeContext';

const Sidebar = ({
  items,
  logo,
  collapsed = false,
  onCollapse,
  footer,
  className = '',
  ...props
}) => {
  const [isCollapsed, setIsCollapsed] = useState(collapsed);
  const location = useLocation();
  const { isDark } = useTheme();

  useEffect(() => {
    if (collapsed !== isCollapsed) {
      setIsCollapsed(collapsed);
    }
  }, [collapsed]);

  const handleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    onCollapse && onCollapse(!isCollapsed);
  };

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-20
        flex flex-col
        bg-white dark:bg-gray-800
        border-r border-gray-200 dark:border-gray-700
        transition-all duration-300
        ${isCollapsed ? 'w-16' : 'w-64'}
        ${className}
      `}
      {...props}
    >
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
        {logo && (
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : ''}`}>
            {typeof logo === 'string' ? (
              <img
                src={logo}
                alt="Logo"
                className={`${isCollapsed ? 'w-8 h-8' : 'w-32 h-8'} object-contain`}
              />
            ) : (
              logo
            )}
          </div>
        )}
        <button
          onClick={handleCollapse}
          className="p-1 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
        >
          <svg
            className={`w-6 h-6 transition-transform duration-300 ${
              isCollapsed ? 'transform rotate-180' : ''
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
            />
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {items.map((item, index) => {
          if (item.type === 'divider') {
            return (
              <div
                key={index}
                className="my-4 border-t border-gray-200 dark:border-gray-700"
              />
            );
          }

          if (item.type === 'section') {
            return (
              <div key={index} className="mb-4">
                {!isCollapsed && (
                  <h3 className="px-3 mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {item.label}
                  </h3>
                )}
                {item.items.map((subItem, subIndex) => (
                  <NavItem
                    key={subIndex}
                    item={subItem}
                    isCollapsed={isCollapsed}
                    isActive={location.pathname === subItem.href}
                  />
                ))}
              </div>
            );
          }

          return (
            <NavItem
              key={index}
              item={item}
              isCollapsed={isCollapsed}
              isActive={location.pathname === item.href}
            />
          );
        })}
      </nav>

      {/* Footer */}
      {footer && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          {footer}
        </div>
      )}
    </aside>
  );
};

Sidebar.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.oneOf(['item', 'divider', 'section']),
      label: PropTypes.string,
      icon: PropTypes.node,
      href: PropTypes.string,
      items: PropTypes.array,
      onClick: PropTypes.func,
      badge: PropTypes.node
    })
  ).isRequired,
  logo: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  collapsed: PropTypes.bool,
  onCollapse: PropTypes.func,
  footer: PropTypes.node,
  className: PropTypes.string
};

// Nav Item Component
const NavItem = ({ item, isCollapsed, isActive }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <Link
      to={item.href}
      onClick={item.onClick}
      className={`
        relative flex items-center px-3 py-2 rounded-lg
        ${
          isActive
            ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/50 dark:text-primary-400'
            : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
        }
        ${isCollapsed ? 'justify-center' : 'space-x-3'}
        transition-colors duration-200
      `}
      onMouseEnter={() => isCollapsed && setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {item.icon && (
        <span className={isCollapsed ? 'w-6 h-6' : 'w-5 h-5'}>
          {item.icon}
        </span>
      )}
      {!isCollapsed && (
        <>
          <span className="flex-1">{item.label}</span>
          {item.badge && <span>{item.badge}</span>}
        </>
      )}
      {isCollapsed && showTooltip && (
        <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded">
          {item.label}
        </div>
      )}
    </Link>
  );
};

NavItem.propTypes = {
  item: PropTypes.shape({
    label: PropTypes.string.isRequired,
    icon: PropTypes.node,
    href: PropTypes.string,
    onClick: PropTypes.func,
    badge: PropTypes.node
  }).isRequired,
  isCollapsed: PropTypes.bool,
  isActive: PropTypes.bool
};

// Mini Sidebar Component
export const MiniSidebar = ({
  items,
  className = '',
  ...props
}) => {
  const location = useLocation();

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-20
        w-16 flex flex-col
        bg-white dark:bg-gray-800
        border-r border-gray-200 dark:border-gray-700
        ${className}
      `}
      {...props}
    >
      <nav className="flex-1 overflow-y-auto px-2 py-4">
        {items.map((item, index) => {
          const isActive = location.pathname === item.href;

          return (
            <Link
              key={index}
              to={item.href}
              onClick={item.onClick}
              className={`
                relative flex items-center justify-center
                p-2 mb-2 rounded-lg
                ${
                  isActive
                    ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/50 dark:text-primary-400'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                }
                group
              `}
            >
              {item.icon && <span className="w-6 h-6">{item.icon}</span>}
              <span className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

MiniSidebar.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      icon: PropTypes.node,
      href: PropTypes.string,
      onClick: PropTypes.func
    })
  ).isRequired,
  className: PropTypes.string
};

export default Sidebar;