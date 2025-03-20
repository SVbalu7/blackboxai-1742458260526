import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const Footer = ({
  logo,
  navigation,
  social,
  legal,
  newsletter,
  copyright,
  className = '',
  ...props
}) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={`
        bg-white dark:bg-gray-800
        border-t border-gray-200 dark:border-gray-700
        ${className}
      `}
      {...props}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            {logo && (
              <div className="flex items-center">
                {typeof logo === 'string' ? (
                  <img
                    src={logo}
                    alt="Logo"
                    className="h-8 w-auto"
                  />
                ) : (
                  logo
                )}
              </div>
            )}
            {social && (
              <div className="flex space-x-4">
                {social.map((item, index) => (
                  <a
                    key={index}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                  >
                    <span className="sr-only">{item.label}</span>
                    <i className={`fab ${item.icon} text-xl`} />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Navigation */}
          {navigation && navigation.map((section, index) => (
            <div key={index}>
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {section.title}
              </h3>
              <ul className="mt-4 space-y-4">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <Link
                      to={item.href}
                      className="text-base text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          {newsletter && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {newsletter.title}
              </h3>
              <p className="mt-4 text-base text-gray-600 dark:text-gray-300">
                {newsletter.description}
              </p>
              <form className="mt-4 flex" onSubmit={newsletter.onSubmit}>
                <input
                  type="email"
                  required
                  placeholder={newsletter.placeholder || 'Enter your email'}
                  className="
                    min-w-0 flex-1 px-4 py-2
                    border border-gray-300 dark:border-gray-600
                    rounded-l-md
                    bg-white dark:bg-gray-700
                    text-gray-900 dark:text-white
                    focus:outline-none focus:ring-2 focus:ring-primary-500
                  "
                />
                <button
                  type="submit"
                  className="
                    inline-flex items-center px-4 py-2
                    border border-transparent
                    rounded-r-md
                    bg-primary-600 hover:bg-primary-700
                    text-white
                    font-medium
                  "
                >
                  Subscribe
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-base text-gray-500 dark:text-gray-400">
              {copyright || `© ${currentYear} All rights reserved.`}
            </div>

            {/* Legal Links */}
            {legal && (
              <div className="flex space-x-6">
                {legal.map((item, index) => (
                  <Link
                    key={index}
                    to={item.href}
                    className="text-base text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

Footer.propTypes = {
  logo: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  navigation: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      items: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string.isRequired,
          href: PropTypes.string.isRequired
        })
      ).isRequired
    })
  ),
  social: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired,
      href: PropTypes.string.isRequired
    })
  ),
  legal: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      href: PropTypes.string.isRequired
    })
  ),
  newsletter: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    placeholder: PropTypes.string,
    onSubmit: PropTypes.func.isRequired
  }),
  copyright: PropTypes.string,
  className: PropTypes.string
};

// Simple Footer Component
export const SimpleFooter = ({
  copyright,
  links,
  className = '',
  ...props
}) => {
  return (
    <footer
      className={`
        bg-white dark:bg-gray-800
        border-t border-gray-200 dark:border-gray-700
        ${className}
      `}
      {...props}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-base text-gray-500 dark:text-gray-400">
            {copyright || `© ${new Date().getFullYear()} All rights reserved.`}
          </div>
          {links && (
            <div className="flex space-x-6">
              {links.map((link, index) => (
                <Link
                  key={index}
                  to={link.href}
                  className="text-base text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};

SimpleFooter.propTypes = {
  copyright: PropTypes.string,
  links: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      href: PropTypes.string.isRequired
    })
  ),
  className: PropTypes.string
};

export default Footer;