import { useState, useRef } from 'react';
import PropTypes from 'prop-types';

const Kanban = ({
  columns,
  onChange,
  addCard,
  addColumn,
  onColumnUpdate,
  onCardUpdate,
  className = '',
  ...props
}) => {
  const [draggedItem, setDraggedItem] = useState(null);
  const [draggedColumn, setDraggedColumn] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);
  const scrollRef = useRef(null);
  const scrollInterval = useRef(null);

  // Handle card drag start
  const handleDragStart = (e, columnId, card) => {
    setDraggedItem({ columnId, card });
    e.target.style.opacity = '0.5';
  };

  // Handle card drag end
  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
    setDraggedItem(null);
    setDragOverColumn(null);
  };

  // Handle card drop
  const handleDrop = (e, targetColumnId) => {
    e.preventDefault();
    if (!draggedItem) return;

    const { columnId: sourceColumnId, card } = draggedItem;
    if (sourceColumnId === targetColumnId) return;

    // Create new columns array with updated cards
    const newColumns = columns.map((column) => {
      if (column.id === sourceColumnId) {
        return {
          ...column,
          cards: column.cards.filter((c) => c.id !== card.id)
        };
      }
      if (column.id === targetColumnId) {
        return {
          ...column,
          cards: [...column.cards, card]
        };
      }
      return column;
    });

    onChange(newColumns);
  };

  // Handle column drag start
  const handleColumnDragStart = (e, column) => {
    setDraggedColumn(column);
    e.target.style.opacity = '0.5';
  };

  // Handle column drag end
  const handleColumnDragEnd = (e) => {
    e.target.style.opacity = '1';
    setDraggedColumn(null);
  };

  // Handle column drop
  const handleColumnDrop = (e, targetColumn) => {
    e.preventDefault();
    if (!draggedColumn || draggedColumn.id === targetColumn.id) return;

    const sourceIndex = columns.findIndex((c) => c.id === draggedColumn.id);
    const targetIndex = columns.findIndex((c) => c.id === targetColumn.id);

    const newColumns = [...columns];
    newColumns.splice(sourceIndex, 1);
    newColumns.splice(targetIndex, 0, draggedColumn);

    onChange(newColumns);
  };

  // Handle auto-scroll during drag
  const handleDragOver = (e) => {
    e.preventDefault();
    if (!scrollRef.current) return;

    const container = scrollRef.current;
    const containerRect = container.getBoundingClientRect();
    const scrollThreshold = 100;

    clearInterval(scrollInterval.current);

    if (e.clientX - containerRect.left < scrollThreshold) {
      // Scroll left
      scrollInterval.current = setInterval(() => {
        container.scrollLeft -= 10;
      }, 20);
    } else if (containerRect.right - e.clientX < scrollThreshold) {
      // Scroll right
      scrollInterval.current = setInterval(() => {
        container.scrollLeft += 10;
      }, 20);
    }
  };

  return (
    <div
      ref={scrollRef}
      className={`
        flex overflow-x-auto
        pb-4 space-x-4
        ${className}
      `}
      onDragOver={handleDragOver}
      onDragEnd={() => clearInterval(scrollInterval.current)}
      {...props}
    >
      {columns.map((column) => (
        <div
          key={column.id}
          draggable
          onDragStart={(e) => handleColumnDragStart(e, column)}
          onDragEnd={handleColumnDragEnd}
          onDrop={(e) => handleColumnDrop(e, column)}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOverColumn(column.id);
          }}
          className={`
            flex-shrink-0 w-80
            bg-gray-50 dark:bg-gray-800
            rounded-lg shadow
            ${dragOverColumn === column.id ? 'border-2 border-primary-500' : ''}
          `}
        >
          {/* Column Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {column.icon && (
                  <span className="text-gray-500 dark:text-gray-400">
                    {column.icon}
                  </span>
                )}
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {column.title}
                </h3>
                {column.count !== undefined && (
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    ({column.cards.length})
                  </span>
                )}
              </div>
              {column.actions}
            </div>
          </div>

          {/* Cards */}
          <div
            className="p-4 space-y-2"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            {column.cards.map((card) => (
              <div
                key={card.id}
                draggable
                onDragStart={(e) => handleDragStart(e, column.id, card)}
                onDragEnd={handleDragEnd}
                className={`
                  p-4 bg-white dark:bg-gray-700
                  rounded-lg shadow-sm
                  cursor-move
                  hover:shadow
                  transition-shadow duration-200
                `}
              >
                {/* Card Content */}
                <div className="space-y-2">
                  {card.title && (
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {card.title}
                    </h4>
                  )}
                  {card.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {card.description}
                    </p>
                  )}
                  {card.content}
                </div>

                {/* Card Footer */}
                {(card.tags || card.meta || card.actions) && (
                  <div className="mt-4 pt-2 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {card.tags?.map((tag, index) => (
                          <span
                            key={index}
                            className={`
                              px-2 py-1 text-xs rounded-full
                              ${tag.color || 'bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-300'}
                            `}
                          >
                            {tag.label}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center space-x-2">
                        {card.meta}
                        {card.actions}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Add Card Button */}
            {addCard && (
              <button
                onClick={() => addCard(column.id)}
                className="
                  w-full p-2
                  text-sm text-gray-500 dark:text-gray-400
                  hover:text-gray-700 dark:hover:text-gray-200
                  hover:bg-gray-100 dark:hover:bg-gray-600
                  rounded
                  transition-colors duration-200
                "
              >
                <i className="fas fa-plus mr-2" />
                Add Card
              </button>
            )}
          </div>
        </div>
      ))}

      {/* Add Column Button */}
      {addColumn && (
        <div className="flex-shrink-0 w-80">
          <button
            onClick={addColumn}
            className="
              w-full h-full
              flex items-center justify-center
              border-2 border-dashed border-gray-300 dark:border-gray-600
              rounded-lg
              text-gray-500 dark:text-gray-400
              hover:text-gray-700 dark:hover:text-gray-200
              hover:border-gray-400 dark:hover:border-gray-500
              transition-colors duration-200
            "
          >
            <i className="fas fa-plus mr-2" />
            Add Column
          </button>
        </div>
      )}
    </div>
  );
};

Kanban.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      icon: PropTypes.node,
      actions: PropTypes.node,
      cards: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          title: PropTypes.string,
          description: PropTypes.string,
          content: PropTypes.node,
          tags: PropTypes.arrayOf(
            PropTypes.shape({
              label: PropTypes.string.isRequired,
              color: PropTypes.string
            })
          ),
          meta: PropTypes.node,
          actions: PropTypes.node
        })
      ).isRequired
    })
  ).isRequired,
  onChange: PropTypes.func.isRequired,
  addCard: PropTypes.func,
  addColumn: PropTypes.func,
  onColumnUpdate: PropTypes.func,
  onCardUpdate: PropTypes.func,
  className: PropTypes.string
};

export default Kanban;