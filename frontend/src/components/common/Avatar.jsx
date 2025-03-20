import PropTypes from 'prop-types';
import { getInitials } from '../../utils/helpers';

const Avatar = ({
  src,
  alt,
  size = 'md',
  shape = 'circle',
  status,
  initials,
  className = '',
  ...props
}) => {
  // Size classes
  const sizeClasses = {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg',
    xl: 'h-16 w-16 text-xl',
    '2xl': 'h-20 w-20 text-2xl'
  };

  // Shape classes
  const shapeClasses = {
    circle: 'rounded-full',
    square: 'rounded-lg'
  };

  // Status classes
  const statusClasses = {
    online: 'bg-green-400',
    offline: 'bg-gray-400',
    busy: 'bg-red-400',
    away: 'bg-yellow-400'
  };

  // Generate background color based on initials
  const generateColor = (text) => {
    const colors = [
      'bg-primary-500',
      'bg-pink-500',
      'bg-purple-500',
      'bg-indigo-500',
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-red-500'
    ];
    
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = text.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  };

  // Get user initials if no image is provided
  const userInitials = initials || (alt ? getInitials(alt) : '');
  const bgColor = generateColor(userInitials);

  return (
    <div className="relative inline-block">
      {src ? (
        // Image Avatar
        <img
          src={src}
          alt={alt}
          className={`
            object-cover
            ${sizeClasses[size]}
            ${shapeClasses[shape]}
            ${className}
          `}
          {...props}
        />
      ) : (
        // Initials Avatar
        <div
          className={`
            flex items-center justify-center text-white
            ${sizeClasses[size]}
            ${shapeClasses[shape]}
            ${bgColor}
            ${className}
          `}
          {...props}
        >
          {userInitials}
        </div>
      )}

      {/* Status Indicator */}
      {status && (
        <span
          className={`
            absolute bottom-0 right-0
            block h-2.5 w-2.5 rounded-full
            ring-2 ring-white dark:ring-gray-900
            ${statusClasses[status]}
          `}
        />
      )}
    </div>
  );
};

Avatar.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', '2xl']),
  shape: PropTypes.oneOf(['circle', 'square']),
  status: PropTypes.oneOf(['online', 'offline', 'busy', 'away']),
  initials: PropTypes.string,
  className: PropTypes.string
};

// Avatar Group Component
export const AvatarGroup = ({
  avatars,
  max = 3,
  size = 'md',
  className = '',
  ...props
}) => {
  const displayAvatars = avatars.slice(0, max);
  const remainingCount = avatars.length - max;

  return (
    <div className={`flex -space-x-2 ${className}`} {...props}>
      {displayAvatars.map((avatar, index) => (
        <Avatar
          key={index}
          size={size}
          className="ring-2 ring-white dark:ring-gray-900"
          {...avatar}
        />
      ))}
      {remainingCount > 0 && (
        <div
          className={`
            flex items-center justify-center
            text-white bg-gray-400 dark:bg-gray-600
            ring-2 ring-white dark:ring-gray-900
            ${sizeClasses[size]}
            rounded-full
          `}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
};

AvatarGroup.propTypes = {
  avatars: PropTypes.arrayOf(
    PropTypes.shape({
      src: PropTypes.string,
      alt: PropTypes.string,
      initials: PropTypes.string
    })
  ).isRequired,
  max: PropTypes.number,
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', '2xl']),
  className: PropTypes.string
};

// Profile Avatar Component
export const ProfileAvatar = ({
  user,
  size = 'lg',
  showStatus = true,
  showBadge = false,
  badgeContent,
  className = '',
  ...props
}) => {
  return (
    <div className={`relative inline-block ${className}`} {...props}>
      <Avatar
        src={user.profileImage}
        alt={user.name}
        size={size}
        status={showStatus ? user.status : undefined}
      />
      
      {showBadge && badgeContent && (
        <div
          className={`
            absolute -top-1 -right-1
            flex items-center justify-center
            min-w-[1.25rem] h-5
            text-xs font-bold
            text-white bg-red-500
            rounded-full
            px-1
          `}
        >
          {badgeContent}
        </div>
      )}
    </div>
  );
};

ProfileAvatar.propTypes = {
  user: PropTypes.shape({
    profileImage: PropTypes.string,
    name: PropTypes.string.isRequired,
    status: PropTypes.oneOf(['online', 'offline', 'busy', 'away'])
  }).isRequired,
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', '2xl']),
  showStatus: PropTypes.bool,
  showBadge: PropTypes.bool,
  badgeContent: PropTypes.node,
  className: PropTypes.string
};

export default Avatar;