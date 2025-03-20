import PropTypes from 'prop-types';

const Chip = ({
  label,
  icon,
  onDelete,
  onClick,
  selected = false,
  disabled = false,
  size = 'md',
  variant = 'solid',
  color = 'primary',
  avatar,
  className = '',
  ...props
}) => {
  // Size classes
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  // Variant classes
  const variantClasses = {
    solid: {
      primary: 'bg-primary-600 text-white hover:bg-primary-700',
      secondary: 'bg-gray-600 text-white hover:bg-gray-700',
      success: 'bg-green-600 text-white hover:bg-green-700',
      warning: 'bg-yellow-600 text-white hover:bg-yellow-700',
      danger: 'bg-red-600 text-white hover:bg-red-700',
      info: 'bg-blue-600 text-white hover:bg-blue-700'
    },
    outline: {
      primary: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20',
      secondary: 'border-2 border-gray-600 text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-900/20',
      success: 'border-2 border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20',
      warning: 'border-2 border-yellow-600 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20',
      danger: 'border-2 border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20',
      info: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20'
    },
    light: {
      primary: 'bg-primary-100 text-primary-800 hover:bg-primary-200 dark:bg-primary-900/20 dark:text-primary-300',
      secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-900/20 dark:text-gray-300',
      success: 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-300',
      warning: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300',
      danger: 'bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-300',
      info: 'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-300'
    }
  };

  return (
    <div
      className={`
        inline-flex items-center
        rounded-full
        transition-colors duration-150
        ${sizeClasses[size]}
        ${variantClasses[variant][color]}
        ${onClick ? 'cursor-pointer' : ''}
        ${selected ? 'ring-2 ring-offset-2 ring-primary-500' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}
        ${className}
      `}
      onClick={!disabled && onClick ? onClick : undefined}
      {...props}
    >
      {/* Avatar */}
      {avatar && (
        <span className="-ml-1 mr-2">
          {typeof avatar === 'string' ? (
            <img
              src={avatar}
              alt=""
              className="h-6 w-6 rounded-full"
            />
          ) : (
            avatar
          )}
        </span>
      )}

      {/* Icon */}
      {icon && !avatar && (
        <span className="-ml-1 mr-2">
          {icon}
        </span>
      )}

      {/* Label */}
      <span>{label}</span>

      {/* Delete Button */}
      {onDelete && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className={`
            ml-2 -mr-1
            rounded-full
            hover:bg-black/10 dark:hover:bg-white/10
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
            ${sizeClasses[size].includes('text-xs') ? 'p-0.5' : 'p-1'}
          `}
          disabled={disabled}
        >
          <svg
            className={sizeClasses[size].includes('text-xs') ? 'w-3 h-3' : 'w-4 h-4'}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

Chip.propTypes = {
  label: PropTypes.string.isRequired,
  icon: PropTypes.node,
  onDelete: PropTypes.func,
  onClick: PropTypes.func,
  selected: PropTypes.bool,
  disabled: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  variant: PropTypes.oneOf(['solid', 'outline', 'light']),
  color: PropTypes.oneOf(['primary', 'secondary', 'success', 'warning', 'danger', 'info']),
  avatar: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  className: PropTypes.string
};

// Filter Chip Component
export const FilterChip = ({
  active = false,
  ...props
}) => {
  return (
    <Chip
      variant={active ? 'solid' : 'outline'}
      color="primary"
      {...props}
    />
  );
};

FilterChip.propTypes = {
  active: PropTypes.bool
};

// Choice Chip Component
export const ChoiceChip = ({
  selected = false,
  onChange,
  ...props
}) => {
  return (
    <Chip
      variant={selected ? 'solid' : 'light'}
      color="primary"
      selected={selected}
      onClick={() => onChange && onChange(!selected)}
      {...props}
    />
  );
};

ChoiceChip.propTypes = {
  selected: PropTypes.bool,
  onChange: PropTypes.func
};

// Input Chip Component
export const InputChip = ({
  value = '',
  onChange,
  onAdd,
  placeholder = 'Type and press Enter',
  ...props
}) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && value.trim()) {
      onAdd(value.trim());
      onChange('');
    }
  };

  return (
    <div className="inline-flex items-center">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="
          px-3 py-1
          border-none
          bg-transparent
          focus:outline-none focus:ring-0
          text-sm
        "
      />
      {value && (
        <button
          onClick={() => {
            onAdd(value.trim());
            onChange('');
          }}
          className="
            p-1 ml-1
            rounded-full
            text-primary-600 hover:bg-primary-50
            dark:text-primary-400 dark:hover:bg-primary-900/20
            focus:outline-none
          "
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      )}
    </div>
  );
};

InputChip.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  placeholder: PropTypes.string
};

export default Chip;