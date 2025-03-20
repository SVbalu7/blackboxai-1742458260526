import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const List = ({
  items,
  variant = 'default',
  size = 'md',
  divided = false,
  hoverable = true,
  selectable = false,
  selected,
  onSelect,
  className = '',
  ...props
}) => {
  // Size classes
  const sizeClasses = {
    sm: 'py-2 px-3 text-sm',
    md: 'py-3 px-4 text-base',
    lg: 'py-4 px-5 text-lg'
  };

  // Variant classes
  const variantClasses = {
    default: 'bg-white dark:bg-gray-800',
    card: 'bg-white dark:bg-gray-800 rounded-lg shadow',
    flat: 'bg-gray-50 dark:bg-gray-900'
  };

  return (
    <ul
      className={`
        ${variantClasses[variant]}
        ${divided ? 'divide-y divide-gray-200 dark:divide-gray-700' : 'space-y-1'}
        ${className}
      `}
      {...props}
    >
      {items.map((item, index) => (
        <ListItem
          key={item.id || index}
          item={item}
          size={size}
          hoverable={hoverable}
          selectable={selectable}
          selected={selected === (item.id || index)}
          onSelect={() => onSelect && onSelect(item.id || index)}
        />
      ))}
    </ul>
  );
};

List.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  variant: PropTypes.oneOf(['default', 'card', 'flat']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  divided: PropTypes.bool,
  hoverable: PropTypes.bool,
  selectable: PropTypes.bool,
  selected: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onSelect: PropTypes.func,
  className: PropTypes.string
};

// List Item Component
const ListItem = ({
  item,
  size,
  hoverable,
  selectable,
  selected,
  onSelect
}) => {
  const sizeClasses = {
    sm: 'py-2 px-3 text-sm',
    md: 'py-3 px-4 text-base',
    lg: 'py-4 px-5 text-lg'
  };

  const baseClasses = `
    relative flex items-center
    ${sizeClasses[size]}
    ${hoverable ? 'hover:bg-gray-50 dark:hover:bg-gray-700' : ''}
    ${selectable ? 'cursor-pointer' : ''}
    ${selected ? 'bg-primary-50 dark:bg-primary-900/20' : ''}
  `;

  const content = (
    <>
      {/* Leading */}
      {item.leading && (
        <div className="flex-shrink-0 mr-4">
          {item.leading}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <div className="truncate">
            {item.title && (
              <div className="font-medium text-gray-900 dark:text-white">
                {item.title}
              </div>
            )}
            {item.subtitle && (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {item.subtitle}
              </div>
            )}
          </div>
          {item.meta && (
            <div className="ml-4 flex-shrink-0 text-sm text-gray-500 dark:text-gray-400">
              {item.meta}
            </div>
          )}
        </div>
        {item.description && (
          <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">
            {item.description}
          </div>
        )}
      </div>

      {/* Trailing */}
      {item.trailing && (
        <div className="flex-shrink-0 ml-4">
          {item.trailing}
        </div>
      )}
    </>
  );

  if (item.href) {
    return (
      <li>
        <Link
          to={item.href}
          className={`${baseClasses} ${item.className || ''}`}
          onClick={onSelect}
        >
          {content}
        </Link>
      </li>
    );
  }

  if (item.onClick || onSelect) {
    return (
      <li>
        <button
          type="button"
          className={`w-full text-left ${baseClasses} ${item.className || ''}`}
          onClick={() => {
            item.onClick?.();
            onSelect?.();
          }}
          disabled={item.disabled}
        >
          {content}
        </button>
      </li>
    );
  }

  return (
    <li className={`${baseClasses} ${item.className || ''}`}>
      {content}
    </li>
  );
};

ListItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.node,
    subtitle: PropTypes.node,
    description: PropTypes.node,
    leading: PropTypes.node,
    trailing: PropTypes.node,
    meta: PropTypes.node,
    href: PropTypes.string,
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
    className: PropTypes.string
  }).isRequired,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  hoverable: PropTypes.bool,
  selectable: PropTypes.bool,
  selected: PropTypes.bool,
  onSelect: PropTypes.func
};

// Action List Component
export const ActionList = ({
  items,
  divided = true,
  ...props
}) => {
  return (
    <List
      items={items.map(item => ({
        ...item,
        trailing: item.icon && (
          <i className={`fas fa-${item.icon} text-gray-400`} />
        )
      }))}
      divided={divided}
      hoverable
      {...props}
    />
  );
};

ActionList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      icon: PropTypes.string,
      onClick: PropTypes.func,
      href: PropTypes.string,
      disabled: PropTypes.bool
    })
  ).isRequired,
  divided: PropTypes.bool
};

// Selection List Component
export const SelectionList = ({
  items,
  value,
  onChange,
  multiple = false,
  ...props
}) => {
  const handleSelect = (itemId) => {
    if (multiple) {
      const newValue = value.includes(itemId)
        ? value.filter(id => id !== itemId)
        : [...value, itemId];
      onChange(newValue);
    } else {
      onChange(itemId === value ? null : itemId);
    }
  };

  return (
    <List
      items={items.map(item => ({
        ...item,
        trailing: (multiple ? value.includes(item.id) : value === item.id) && (
          <i className="fas fa-check text-primary-600" />
        )
      }))}
      selected={value}
      onSelect={handleSelect}
      hoverable
      selectable
      {...props}
    />
  );
};

SelectionList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired
    })
  ).isRequired,
  value: PropTypes.oneOfType([
    PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number]))
  ]),
  onChange: PropTypes.func.isRequired,
  multiple: PropTypes.bool
};

export default List;