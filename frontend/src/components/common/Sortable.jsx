import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

const Sortable = ({
  items,
  onChange,
  renderItem,
  direction = 'vertical',
  handle = false,
  animation = true,
  disabled = false,
  className = '',
  ...props
}) => {
  const [draggedItem, setDraggedItem] = useState(null);
  const [draggedOverItem, setDraggedOverItem] = useState(null);
  const [positions, setPositions] = useState({});
  const containerRef = useRef(null);

  // Initialize positions on mount or when items change
  useEffect(() => {
    const newPositions = {};
    items.forEach((item, index) => {
      newPositions[item.id] = index;
    });
    setPositions(newPositions);
  }, [items]);

  // Handle drag start
  const handleDragStart = (e, item) => {
    if (disabled) return;

    setDraggedItem(item);
    e.target.style.opacity = '0.5';

    // Set drag image if handle is used
    if (handle && e.target.querySelector('[data-drag-handle]')) {
      const handleEl = e.target.querySelector('[data-drag-handle]');
      const rect = handleEl.getBoundingClientRect();
      e.dataTransfer.setDragImage(
        handleEl,
        e.clientX - rect.left,
        e.clientY - rect.top
      );
    }
  };

  // Handle drag end
  const handleDragEnd = (e) => {
    if (disabled) return;

    e.target.style.opacity = '1';
    setDraggedItem(null);
    setDraggedOverItem(null);

    if (draggedOverItem) {
      const newItems = [...items];
      const draggedIndex = positions[draggedItem.id];
      const dropIndex = positions[draggedOverItem.id];

      // Reorder items
      newItems.splice(draggedIndex, 1);
      newItems.splice(dropIndex, 0, draggedItem);

      // Update positions
      const newPositions = {};
      newItems.forEach((item, index) => {
        newPositions[item.id] = index;
      });
      setPositions(newPositions);

      // Notify parent
      onChange(newItems);
    }
  };

  // Handle drag over
  const handleDragOver = (e, item) => {
    if (disabled || !draggedItem || item.id === draggedItem.id) return;

    e.preventDefault();
    setDraggedOverItem(item);

    const draggedIndex = positions[draggedItem.id];
    const hoverIndex = positions[item.id];

    // Get rectangle on screen
    const hoverBoundingRect = e.target.getBoundingClientRect();

    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
    const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;

    // Get mouse position
    const clientOffset = {
      x: e.clientX - hoverBoundingRect.left,
      y: e.clientY - hoverBoundingRect.top
    };

    // Only perform the move when the mouse has crossed half of the items height/width
    if (direction === 'vertical') {
      if ((draggedIndex < hoverIndex && clientOffset.y < hoverMiddleY) ||
          (draggedIndex > hoverIndex && clientOffset.y > hoverMiddleY)) {
        return;
      }
    } else {
      if ((draggedIndex < hoverIndex && clientOffset.x < hoverMiddleX) ||
          (draggedIndex > hoverIndex && clientOffset.x > hoverMiddleX)) {
        return;
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className={`
        ${direction === 'vertical' ? 'flex flex-col' : 'flex flex-row'}
        ${className}
      `}
      {...props}
    >
      {items.map((item) => (
        <div
          key={item.id}
          draggable={!disabled && (!handle || !!item.handle)}
          onDragStart={(e) => handleDragStart(e, item)}
          onDragEnd={handleDragEnd}
          onDragOver={(e) => handleDragOver(e, item)}
          className={`
            ${animation ? 'transition-transform duration-200' : ''}
            ${disabled ? 'cursor-default' : handle ? 'cursor-default' : 'cursor-move'}
          `}
        >
          {renderItem({
            item,
            isDragging: draggedItem?.id === item.id,
            isOver: draggedOverItem?.id === item.id,
            dragHandleProps: handle ? {
              'data-drag-handle': true,
              draggable: true,
              onDragStart: (e) => {
                e.stopPropagation();
                handleDragStart(e, item);
              }
            } : {}
          })}
        </div>
      ))}
    </div>
  );
};

Sortable.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
    })
  ).isRequired,
  onChange: PropTypes.func.isRequired,
  renderItem: PropTypes.func.isRequired,
  direction: PropTypes.oneOf(['vertical', 'horizontal']),
  handle: PropTypes.bool,
  animation: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string
};

// Sortable List Component
export const SortableList = ({
  items,
  onChange,
  renderItem,
  ...props
}) => {
  return (
    <Sortable
      items={items}
      onChange={onChange}
      renderItem={({ item, isDragging, isOver, dragHandleProps }) => (
        <div
          className={`
            p-4 mb-2 rounded-lg
            bg-white dark:bg-gray-800
            border border-gray-200 dark:border-gray-700
            ${isDragging ? 'opacity-50' : ''}
            ${isOver ? 'border-primary-500' : ''}
          `}
        >
          <div className="flex items-center">
            <div {...dragHandleProps} className="mr-3 cursor-move text-gray-400">
              <i className="fas fa-grip-vertical" />
            </div>
            {renderItem(item)}
          </div>
        </div>
      )}
      handle
      {...props}
    />
  );
};

SortableList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
    })
  ).isRequired,
  onChange: PropTypes.func.isRequired,
  renderItem: PropTypes.func.isRequired
};

// Sortable Grid Component
export const SortableGrid = ({
  items,
  onChange,
  renderItem,
  columns = 3,
  gap = 4,
  ...props
}) => {
  return (
    <Sortable
      items={items}
      onChange={onChange}
      renderItem={({ item, isDragging, isOver }) => (
        <div
          className={`
            aspect-square rounded-lg overflow-hidden
            ${isDragging ? 'opacity-50' : ''}
            ${isOver ? 'ring-2 ring-primary-500' : ''}
          `}
        >
          {renderItem(item)}
        </div>
      )}
      direction="horizontal"
      className={`
        grid gap-${gap}
        grid-cols-1
        sm:grid-cols-2
        ${columns >= 3 ? 'lg:grid-cols-3' : ''}
        ${columns >= 4 ? 'xl:grid-cols-4' : ''}
      `}
      {...props}
    />
  );
};

SortableGrid.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
    })
  ).isRequired,
  onChange: PropTypes.func.isRequired,
  renderItem: PropTypes.func.isRequired,
  columns: PropTypes.number,
  gap: PropTypes.number
};

export default Sortable;