import { useState } from 'react';
import PropTypes from 'prop-types';

const Tree = ({
  data,
  defaultExpanded = false,
  onSelect,
  selectedId,
  showIcon = true,
  size = 'md',
  className = '',
  ...props
}) => {
  return (
    <div
      className={`
        space-y-1
        ${className}
      `}
      role="tree"
      {...props}
    >
      {data.map((node) => (
        <TreeNode
          key={node.id}
          node={node}
          level={0}
          defaultExpanded={defaultExpanded}
          onSelect={onSelect}
          selectedId={selectedId}
          showIcon={showIcon}
          size={size}
        />
      ))}
    </div>
  );
};

Tree.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired,
      children: PropTypes.array
    })
  ).isRequired,
  defaultExpanded: PropTypes.bool,
  onSelect: PropTypes.func,
  selectedId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  showIcon: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string
};

// Tree Node Component
const TreeNode = ({
  node,
  level,
  defaultExpanded,
  onSelect,
  selectedId,
  showIcon,
  size
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const hasChildren = node.children && node.children.length > 0;

  // Size classes
  const sizeClasses = {
    sm: 'py-1 text-sm',
    md: 'py-1.5 text-base',
    lg: 'py-2 text-lg'
  };

  // Handle expand/collapse
  const handleToggle = (e) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  // Handle selection
  const handleSelect = () => {
    if (onSelect) {
      onSelect(node);
    }
  };

  return (
    <div role="treeitem" aria-expanded={hasChildren ? isExpanded : undefined}>
      <div
        className={`
          flex items-center
          pl-${level * 4}
          ${sizeClasses[size]}
          ${onSelect ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800' : ''}
          ${selectedId === node.id ? 'bg-primary-50 dark:bg-primary-900/20' : ''}
          rounded-lg
        `}
        onClick={handleSelect}
      >
        {/* Expand/Collapse Button */}
        <div className="w-6 flex-shrink-0">
          {hasChildren && (
            <button
              type="button"
              onClick={handleToggle}
              className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
            >
              <i className={`fas fa-chevron-${isExpanded ? 'down' : 'right'}`} />
            </button>
          )}
        </div>

        {/* Icon */}
        {showIcon && (
          <div className="w-6 flex-shrink-0">
            {node.icon ? (
              <span className="text-gray-400 dark:text-gray-500">
                {node.icon}
              </span>
            ) : hasChildren ? (
              <i className="fas fa-folder text-yellow-400" />
            ) : (
              <i className="fas fa-file text-gray-400" />
            )}
          </div>
        )}

        {/* Label */}
        <span className="ml-2 truncate">{node.label}</span>

        {/* Actions */}
        {node.actions && (
          <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
            {node.actions}
          </div>
        )}
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div role="group">
          {node.children.map((childNode) => (
            <TreeNode
              key={childNode.id}
              node={childNode}
              level={level + 1}
              defaultExpanded={defaultExpanded}
              onSelect={onSelect}
              selectedId={selectedId}
              showIcon={showIcon}
              size={size}
            />
          ))}
        </div>
      )}
    </div>
  );
};

TreeNode.propTypes = {
  node: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    label: PropTypes.string.isRequired,
    children: PropTypes.array,
    icon: PropTypes.node,
    actions: PropTypes.node
  }).isRequired,
  level: PropTypes.number.isRequired,
  defaultExpanded: PropTypes.bool,
  onSelect: PropTypes.func,
  selectedId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  showIcon: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg'])
};

// File Tree Component
export const FileTree = ({
  files,
  onSelect,
  ...props
}) => {
  // Convert file paths to tree structure
  const buildFileTree = (paths) => {
    const root = [];
    const map = {};

    paths.forEach((path) => {
      const parts = path.split('/');
      let current = root;

      parts.forEach((part, index) => {
        const isFile = index === parts.length - 1;
        const id = parts.slice(0, index + 1).join('/');
        let node = map[id];

        if (!node) {
          node = {
            id,
            label: part,
            children: isFile ? undefined : []
          };
          map[id] = node;
          current.push(node);
        }

        if (!isFile) {
          current = node.children;
        }
      });
    });

    return root;
  };

  return (
    <Tree
      data={buildFileTree(files)}
      onSelect={onSelect}
      {...props}
    />
  );
};

FileTree.propTypes = {
  files: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSelect: PropTypes.func
};

// Directory Tree Component
export const DirectoryTree = ({
  data,
  ...props
}) => {
  return (
    <Tree
      data={data}
      showIcon
      defaultExpanded
      {...props}
    />
  );
};

DirectoryTree.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired,
      children: PropTypes.array
    })
  ).isRequired
};

export default Tree;