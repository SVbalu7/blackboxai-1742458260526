import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';

const Portal = ({
  children,
  containerId = 'portal-root',
  className = '',
  ...props
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Create portal container if it doesn't exist
    let portalContainer = document.getElementById(containerId);
    if (!portalContainer) {
      portalContainer = document.createElement('div');
      portalContainer.setAttribute('id', containerId);
      document.body.appendChild(portalContainer);
    }

    return () => {
      // Clean up empty portal container on unmount
      portalContainer = document.getElementById(containerId);
      if (portalContainer && !portalContainer.hasChildNodes()) {
        document.body.removeChild(portalContainer);
      }
    };
  }, [containerId]);

  if (!mounted) return null;

  const container = document.getElementById(containerId);
  if (!container) return null;

  return createPortal(
    <div className={className} {...props}>
      {children}
    </div>,
    container
  );
};

Portal.propTypes = {
  children: PropTypes.node.isRequired,
  containerId: PropTypes.string,
  className: PropTypes.string
};

// Modal Portal Component
export const ModalPortal = ({
  children,
  isOpen,
  onClose,
  className = '',
  ...props
}) => {
  if (!isOpen) return null;

  return (
    <Portal
      containerId="modal-root"
      className={`
        fixed inset-0 z-50
        overflow-y-auto
        ${className}
      `}
      {...props}
    >
      <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          aria-hidden="true"
          onClick={onClose}
        />

        {/* Modal content */}
        <div className="relative inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
          {children}
        </div>
      </div>
    </Portal>
  );
};

ModalPortal.propTypes = {
  children: PropTypes.node.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  className: PropTypes.string
};

// Tooltip Portal Component
export const TooltipPortal = ({
  children,
  targetRect,
  position = 'top',
  className = '',
  ...props
}) => {
  if (!targetRect) return null;

  // Calculate position
  const getPosition = () => {
    const padding = 8; // Space between target and tooltip
    const positions = {
      top: {
        top: targetRect.top - padding,
        left: targetRect.left + targetRect.width / 2,
        transform: 'translate(-50%, -100%)'
      },
      bottom: {
        top: targetRect.bottom + padding,
        left: targetRect.left + targetRect.width / 2,
        transform: 'translate(-50%, 0)'
      },
      left: {
        top: targetRect.top + targetRect.height / 2,
        left: targetRect.left - padding,
        transform: 'translate(-100%, -50%)'
      },
      right: {
        top: targetRect.top + targetRect.height / 2,
        left: targetRect.right + padding,
        transform: 'translate(0, -50%)'
      }
    };

    return positions[position];
  };

  const tooltipPosition = getPosition();

  return (
    <Portal
      containerId="tooltip-root"
      className={`
        fixed z-50
        pointer-events-none
        ${className}
      `}
      style={{
        top: tooltipPosition.top,
        left: tooltipPosition.left,
        transform: tooltipPosition.transform
      }}
      {...props}
    >
      {children}
    </Portal>
  );
};

TooltipPortal.propTypes = {
  children: PropTypes.node.isRequired,
  targetRect: PropTypes.shape({
    top: PropTypes.number.isRequired,
    right: PropTypes.number.isRequired,
    bottom: PropTypes.number.isRequired,
    left: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
  }),
  position: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
  className: PropTypes.string
};

// Dropdown Portal Component
export const DropdownPortal = ({
  children,
  targetRect,
  position = 'bottom',
  align = 'left',
  className = '',
  ...props
}) => {
  if (!targetRect) return null;

  // Calculate position
  const getPosition = () => {
    const padding = 4; // Space between target and dropdown
    const positions = {
      bottom: {
        top: targetRect.bottom + padding,
        left: align === 'left' ? targetRect.left : targetRect.right,
        transform: align === 'left' ? 'translateY(0)' : 'translateX(-100%)'
      },
      top: {
        top: targetRect.top - padding,
        left: align === 'left' ? targetRect.left : targetRect.right,
        transform: align === 'left' ? 'translateY(-100%)' : 'translate(-100%, -100%)'
      }
    };

    return positions[position];
  };

  const dropdownPosition = getPosition();

  return (
    <Portal
      containerId="dropdown-root"
      className={`
        fixed z-50
        ${className}
      `}
      style={{
        top: dropdownPosition.top,
        left: dropdownPosition.left,
        transform: dropdownPosition.transform
      }}
      {...props}
    >
      {children}
    </Portal>
  );
};

DropdownPortal.propTypes = {
  children: PropTypes.node.isRequired,
  targetRect: PropTypes.shape({
    top: PropTypes.number.isRequired,
    right: PropTypes.number.isRequired,
    bottom: PropTypes.number.isRequired,
    left: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
  }),
  position: PropTypes.oneOf(['top', 'bottom']),
  align: PropTypes.oneOf(['left', 'right']),
  className: PropTypes.string
};

export default Portal;