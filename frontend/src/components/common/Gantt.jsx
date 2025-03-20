import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { format, addDays, differenceInDays, isWithinInterval } from 'date-fns';

const Gantt = ({
  tasks,
  startDate,
  endDate,
  onChange,
  dayWidth = 40,
  rowHeight = 40,
  showWeekends = true,
  showToday = true,
  className = '',
  ...props
}) => {
  const [dragging, setDragging] = useState(null);
  const [resizing, setResizing] = useState(null);
  const containerRef = useRef(null);

  // Calculate total days
  const totalDays = differenceInDays(endDate, startDate) + 1;

  // Generate dates array
  const dates = Array.from({ length: totalDays }, (_, i) => addDays(startDate, i));

  // Handle drag start
  const handleDragStart = (e, taskId, type = 'move') => {
    const rect = e.target.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;

    if (type === 'move') {
      setDragging({ taskId, offsetX });
    } else {
      setResizing({ taskId, edge: type, offsetX });
    }
  };

  // Handle drag
  const handleDrag = (e) => {
    if (!dragging && !resizing) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - containerRect.left;
    const dayIndex = Math.floor(x / dayWidth);
    const newDate = addDays(startDate, dayIndex);

    if (dragging) {
      const task = tasks.find(t => t.id === dragging.taskId);
      const duration = differenceInDays(task.endDate, task.startDate);
      
      onChange(tasks.map(t => {
        if (t.id === dragging.taskId) {
          return {
            ...t,
            startDate: newDate,
            endDate: addDays(newDate, duration)
          };
        }
        return t;
      }));
    }

    if (resizing) {
      const task = tasks.find(t => t.id === resizing.taskId);
      
      onChange(tasks.map(t => {
        if (t.id === resizing.taskId) {
          if (resizing.edge === 'left') {
            return {
              ...t,
              startDate: newDate
            };
          } else {
            return {
              ...t,
              endDate: newDate
            };
          }
        }
        return t;
      }));
    }
  };

  // Handle drag end
  const handleDragEnd = () => {
    setDragging(null);
    setResizing(null);
  };

  // Attach event listeners
  useEffect(() => {
    if (dragging || resizing) {
      window.addEventListener('mousemove', handleDrag);
      window.addEventListener('mouseup', handleDragEnd);
      return () => {
        window.removeEventListener('mousemove', handleDrag);
        window.removeEventListener('mouseup', handleDragEnd);
      };
    }
  }, [dragging, resizing]);

  return (
    <div
      ref={containerRef}
      className={`overflow-auto border border-gray-200 dark:border-gray-700 rounded-lg ${className}`}
      {...props}
    >
      <div style={{ minWidth: totalDays * dayWidth }}>
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-800">
          {/* Months */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            {dates.map((date, index) => {
              if (index === 0 || date.getDate() === 1) {
                const daysInMonth = dates.filter(d => 
                  d.getMonth() === date.getMonth() && 
                  d.getFullYear() === date.getFullYear()
                ).length;
                
                return (
                  <div
                    key={date.toISOString()}
                    className="border-r border-gray-200 dark:border-gray-700 px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400"
                    style={{ width: daysInMonth * dayWidth }}
                  >
                    {format(date, 'MMMM yyyy')}
                  </div>
                );
              }
              return null;
            })}
          </div>

          {/* Days */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            {dates.map((date) => (
              <div
                key={date.toISOString()}
                className={`
                  border-r border-gray-200 dark:border-gray-700
                  px-2 py-1 text-xs text-gray-500 dark:text-gray-400
                  ${!showWeekends && [0, 6].includes(date.getDay()) ? 'bg-gray-50 dark:bg-gray-900' : ''}
                  ${showToday && isWithinInterval(new Date(), {
                    start: date,
                    end: addDays(date, 1)
                  }) ? 'bg-primary-50 dark:bg-primary-900/20' : ''}
                `}
                style={{ width: dayWidth }}
              >
                {format(date, 'd')}
              </div>
            ))}
          </div>
        </div>

        {/* Tasks */}
        <div>
          {tasks.map((task) => {
            const startOffset = differenceInDays(task.startDate, startDate);
            const duration = differenceInDays(task.endDate, task.startDate) + 1;
            const width = duration * dayWidth;

            return (
              <div
                key={task.id}
                className="flex items-center border-b border-gray-200 dark:border-gray-700"
                style={{ height: rowHeight }}
              >
                {/* Task Label */}
                <div
                  className="sticky left-0 z-10 flex-shrink-0 w-48 px-4 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700"
                >
                  <div className="truncate text-sm text-gray-900 dark:text-white">
                    {task.title}
                  </div>
                </div>

                {/* Task Bar */}
                <div className="relative flex-1">
                  <div
                    className={`
                      absolute top-2 h-8 rounded
                      bg-primary-500 dark:bg-primary-600
                      ${!disabled ? 'cursor-move' : ''}
                    `}
                    style={{
                      left: startOffset * dayWidth,
                      width
                    }}
                    onMouseDown={(e) => !disabled && handleDragStart(e, task.id)}
                  >
                    {/* Left Resize Handle */}
                    {!disabled && (
                      <div
                        className="absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize"
                        onMouseDown={(e) => handleDragStart(e, task.id, 'left')}
                      />
                    )}

                    {/* Right Resize Handle */}
                    {!disabled && (
                      <div
                        className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize"
                        onMouseDown={(e) => handleDragStart(e, task.id, 'right')}
                      />
                    )}

                    {/* Task Progress */}
                    {task.progress !== undefined && (
                      <div
                        className="absolute top-0 left-0 bottom-0 bg-primary-600 dark:bg-primary-700 rounded"
                        style={{ width: `${task.progress}%` }}
                      />
                    )}

                    {/* Task Content */}
                    <div className="absolute inset-0 px-2 flex items-center justify-between text-white">
                      <span className="text-sm truncate">
                        {format(task.startDate, 'MMM d')} - {format(task.endDate, 'MMM d')}
                      </span>
                      {task.progress !== undefined && (
                        <span className="text-sm">{task.progress}%</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

Gantt.propTypes = {
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired,
      startDate: PropTypes.instanceOf(Date).isRequired,
      endDate: PropTypes.instanceOf(Date).isRequired,
      progress: PropTypes.number
    })
  ).isRequired,
  startDate: PropTypes.instanceOf(Date).isRequired,
  endDate: PropTypes.instanceOf(Date).isRequired,
  onChange: PropTypes.func,
  dayWidth: PropTypes.number,
  rowHeight: PropTypes.number,
  showWeekends: PropTypes.bool,
  showToday: PropTypes.bool,
  className: PropTypes.string
};

export default Gantt;