import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Transition } from '@headlessui/react';

const Tooltip = ({
  children,
  content,
  position = 'top',
  delay = 200,
  maxWidth = 200,
  arrow = true,
  className = '',
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef(null);
  const targetRef = useRef(null);
  const timeoutRef = useRef(null);

  // Position classes
  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };

  // Arrow classes
  const arrowClasses = {
    top: 'bottom-[-4px] left-1/2 -translate-x-1/2 border-t-4 border-x-4 border-t-gray-900 border-x-transparent dark:border-t-gray-700',
    bottom: 'top-[-4px] left-1/2 -translate-x-1/2 border-b-4 border-x-4 border-b-gray-900 border-x-transparent dark:border-b-gray-700',
    left: 'right-[-4px] top-1/2 -translate-y-1/2 border-l-4 border-y-4 border-l-gray-900 border-y-transparent dark:border-l-gray-700',
    right: 'left-[-4px] top-1/2 -translate-y-1/2 border-r-4 border-y-4 border-r-gray-900 border-y-transparent dark:border-r-gray-700'
  };

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
        setIsVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={targetRef}
      {...props}
    >
      {children}
      <Transition
        show={isVisible}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <div
          ref={tooltipRef}
          className={`
            absolute z-50
            ${positionClasses[position]}
            ${className}
          `}
          style={{ maxWidth }}
        >
          <div className="relative">
            <div className="bg-gray-900 dark:bg-gray-700 text-white rounded-lg py-1 px-2 text-sm shadow-lg">
              {content}
            </div>
            {arrow && (
              <div className={`absolute w-0 h-0 ${arrowClasses[position]}`} />
            )}
          </div>
        </div>
      </Transition>
    </div>
  );
};

Tooltip.propTypes = {
  children: PropTypes.node.isRequired,
  content: PropTypes.node.isRequired,
  position: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
  delay: PropTypes.number,
  maxWidth: PropTypes.number,
  arrow: PropTypes.bool,
  className: PropTypes.string
};

// Info Tooltip Component
export const InfoTooltip = ({
  content,
  position = 'top',
  className = '',
  ...props
}) => {
  return (
    <Tooltip
      content={content}
      position={position}
      className={className}
      {...props}
    >
      <div className="inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-gray-400 dark:bg-gray-600 rounded-full hover:bg-gray-500 dark:hover:bg-gray-500">
        i
      </div>
    </Tooltip>
  );
};

InfoTooltip.propTypes = {
  content: PropTypes.node.isRequired,
  position: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
  className: PropTypes.string
};

// Error Tooltip Component
export const ErrorTooltip = ({
  content,
  position = 'top',
  className = '',
  ...props
}) => {
  return (
    <Tooltip
      content={content}
      position={position}
      className={className}
      {...props}
    >
      <div className="inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 dark:bg-red-600 rounded-full hover:bg-red-600 dark:hover:bg-red-700">
        !
      </div>
    </Tooltip>
  );
};

ErrorTooltip.propTypes = {
  content: PropTypes.node.isRequired,
  position: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
  className: PropTypes.string
};

// Help Tooltip Component
export const HelpTooltip = ({
  content,
  position = 'top',
  className = '',
  ...props
}) => {
  return (
    <Tooltip
      content={content}
      position={position}
      className={className}
      {...props}
    >
      <div className="inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-blue-500 dark:bg-blue-600 rounded-full hover:bg-blue-600 dark:hover:bg-blue-700">
        ?
      </div>
    </Tooltip>
  );
};

HelpTooltip.propTypes = {
  content: PropTypes.node.isRequired,
  position: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
  className: PropTypes.string
};

export default Tooltip;