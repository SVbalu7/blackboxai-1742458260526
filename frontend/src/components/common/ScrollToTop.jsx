import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

// Component to handle scroll restoration on route changes
export const ScrollRestoration = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Scroll to top button component
const ScrollToTop = ({
  showAt = 400,
  visibilityClass = 'opacity-100',
  hiddenClass = 'opacity-0',
  className = '',
  smooth = true,
  children,
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled up to given distance
  const toggleVisibility = () => {
    if (window.pageYOffset > showAt) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Set the top coordinate to 0
  // Make scrolling smooth
  const scrollToTop = () => {
    if (smooth) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      window.scrollTo(0, 0);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const defaultButton = (
    <button
      type="button"
      aria-label="Scroll to top"
      className={`
        fixed bottom-4 right-4
        p-2 rounded-full
        bg-primary-600 text-white
        hover:bg-primary-700
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
        transition-all duration-300
        ${isVisible ? visibilityClass : hiddenClass}
        ${className}
      `}
      onClick={scrollToTop}
      {...props}
    >
      <svg
        className="h-6 w-6"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    </button>
  );

  return children ? (
    <div
      onClick={scrollToTop}
      className={`
        cursor-pointer
        transition-all duration-300
        ${isVisible ? visibilityClass : hiddenClass}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  ) : (
    defaultButton
  );
};

ScrollToTop.propTypes = {
  showAt: PropTypes.number,
  visibilityClass: PropTypes.string,
  hiddenClass: PropTypes.string,
  className: PropTypes.string,
  smooth: PropTypes.bool,
  children: PropTypes.node
};

// Infinite scroll component
export const InfiniteScroll = ({
  children,
  loadMore,
  hasMore,
  loader,
  threshold = 100,
  className = '',
  ...props
}) => {
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const handleScroll = async () => {
      if (!hasMore || isFetching) return;

      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const clientHeight = window.innerHeight;

      if (scrollHeight - scrollTop - clientHeight < threshold) {
        setIsFetching(true);
        await loadMore();
        setIsFetching(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, isFetching, loadMore, threshold]);

  return (
    <div className={className} {...props}>
      {children}
      {isFetching && loader}
    </div>
  );
};

InfiniteScroll.propTypes = {
  children: PropTypes.node.isRequired,
  loadMore: PropTypes.func.isRequired,
  hasMore: PropTypes.bool.isRequired,
  loader: PropTypes.node,
  threshold: PropTypes.number,
  className: PropTypes.string
};

// Scroll spy component
export const ScrollSpy = ({
  items,
  offset = 100,
  activeClass = 'active',
  smooth = true,
  className = '',
  ...props
}) => {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + offset;

      const active = items.find(({ id }) => {
        const element = document.getElementById(id);
        if (!element) return false;

        const { offsetTop, offsetHeight } = element;
        return scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight;
      });

      if (active) {
        setActiveId(active.id);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [items, offset]);

  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (!element) return;

    const top = element.offsetTop - offset;

    if (smooth) {
      window.scrollTo({
        top,
        behavior: 'smooth'
      });
    } else {
      window.scrollTo(0, top);
    }
  };

  return (
    <nav className={className} {...props}>
      <ul className="space-y-2">
        {items.map(({ id, label }) => (
          <li key={id}>
            <button
              type="button"
              onClick={() => scrollTo(id)}
              className={`
                block w-full text-left px-4 py-2 rounded
                hover:bg-gray-100 dark:hover:bg-gray-800
                ${activeId === id ? activeClass : ''}
              `}
            >
              {label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

ScrollSpy.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })
  ).isRequired,
  offset: PropTypes.number,
  activeClass: PropTypes.string,
  smooth: PropTypes.bool,
  className: PropTypes.string
};

export default ScrollToTop;