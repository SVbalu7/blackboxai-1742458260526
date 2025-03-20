import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addDays,
  isSameDay,
  parseISO,
  isWithinInterval
} from 'date-fns';

const Scheduler = ({
  events,
  onEventClick,
  onEventCreate,
  onEventUpdate,
  onEventDelete,
  view = 'week',
  firstDayOfWeek = 0,
  minTime = 0,
  maxTime = 24,
  step = 30,
  height = '600px',
  readOnly = false,
  className = '',
  ...props
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [draggedEvent, setDraggedEvent] = useState(null);
  const [newEvent, setNewEvent] = useState(null);

  // Generate time slots
  const timeSlots = Array.from(
    { length: ((maxTime - minTime) * 60) / step },
    (_, i) => minTime + (i * step) / 60
  );

  // Get week days
  const weekDays = eachDayOfInterval({
    start: startOfWeek(selectedDate, { weekStartsOn: firstDayOfWeek }),
    end: endOfWeek(selectedDate, { weekStartsOn: firstDayOfWeek })
  });

  // Format time
  const formatTime = (time) => {
    const hours = Math.floor(time);
    const minutes = Math.round((time - hours) * 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  // Handle event drag start
  const handleEventDragStart = (event) => {
    if (readOnly) return;
    setDraggedEvent(event);
  };

  // Handle event drag end
  const handleEventDragEnd = () => {
    setDraggedEvent(null);
  };

  // Handle time slot click
  const handleTimeSlotClick = (date, time) => {
    if (readOnly) return;

    const startTime = new Date(date);
    startTime.setHours(Math.floor(time));
    startTime.setMinutes((time % 1) * 60);

    const endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + step);

    onEventCreate?.({
      start: startTime,
      end: endTime
    });
  };

  // Handle event drop
  const handleEventDrop = (date, time) => {
    if (!draggedEvent) return;

    const duration = (draggedEvent.end - draggedEvent.start) / (60 * 1000);
    const newStart = new Date(date);
    newStart.setHours(Math.floor(time));
    newStart.setMinutes((time % 1) * 60);
    const newEnd = new Date(newStart);
    newEnd.setMinutes(newEnd.getMinutes() + duration);

    onEventUpdate?.({
      ...draggedEvent,
      start: newStart,
      end: newEnd
    });
  };

  return (
    <div
      className={`
        overflow-auto border border-gray-200 dark:border-gray-700 rounded-lg
        ${className}
      `}
      style={{ height }}
      {...props}
    >
      <div className="min-w-[800px]">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-800">
          <div className="grid grid-cols-8 border-b border-gray-200 dark:border-gray-700">
            {/* Time column header */}
            <div className="p-4 text-sm font-medium text-gray-500 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700">
              Time
            </div>

            {/* Day columns headers */}
            {weekDays.map((day) => (
              <div
                key={day.toISOString()}
                className="p-4 text-center border-r border-gray-200 dark:border-gray-700"
              >
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {format(day, 'EEEE')}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {format(day, 'MMM d')}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Time Grid */}
        <div className="relative grid grid-cols-8">
          {/* Time slots */}
          {timeSlots.map((time) => (
            <div
              key={time}
              className="grid grid-cols-8 border-b border-gray-200 dark:border-gray-700"
              style={{ height: `${step}px` }}
            >
              {/* Time label */}
              <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700">
                {formatTime(time)}
              </div>

              {/* Day columns */}
              {weekDays.map((day) => (
                <div
                  key={day.toISOString()}
                  className="relative border-r border-gray-200 dark:border-gray-700"
                  onClick={() => handleTimeSlotClick(day, time)}
                  onDragOver={(e) => {
                    e.preventDefault();
                    handleEventDrop(day, time);
                  }}
                />
              ))}
            </div>
          ))}

          {/* Events */}
          {events.map((event) => {
            const startTime = new Date(event.start);
            const endTime = new Date(event.end);
            const dayIndex = weekDays.findIndex((day) => isSameDay(day, startTime));
            if (dayIndex === -1) return null;

            const top = ((startTime.getHours() + startTime.getMinutes() / 60 - minTime) * 60) / step;
            const height = ((endTime - startTime) / (1000 * 60)) / step;

            return (
              <div
                key={event.id}
                className={`
                  absolute rounded-lg p-2
                  ${event.color || 'bg-primary-500 dark:bg-primary-600'}
                  text-white
                  cursor-pointer
                  ${readOnly ? '' : 'cursor-move'}
                `}
                style={{
                  top: `${top * step}px`,
                  height: `${height * step}px`,
                  left: `${(dayIndex + 1) * 12.5}%`,
                  width: '11.5%'
                }}
                draggable={!readOnly}
                onDragStart={() => handleEventDragStart(event)}
                onDragEnd={handleEventDragEnd}
                onClick={() => onEventClick?.(event)}
              >
                <div className="text-sm font-medium truncate">
                  {event.title}
                </div>
                <div className="text-xs truncate">
                  {format(startTime, 'HH:mm')} - {format(endTime, 'HH:mm')}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

Scheduler.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired,
      start: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,
      end: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,
      color: PropTypes.string
    })
  ).isRequired,
  onEventClick: PropTypes.func,
  onEventCreate: PropTypes.func,
  onEventUpdate: PropTypes.func,
  onEventDelete: PropTypes.func,
  view: PropTypes.oneOf(['day', 'week', 'month']),
  firstDayOfWeek: PropTypes.number,
  minTime: PropTypes.number,
  maxTime: PropTypes.number,
  step: PropTypes.number,
  height: PropTypes.string,
  readOnly: PropTypes.bool,
  className: PropTypes.string
};

export default Scheduler;