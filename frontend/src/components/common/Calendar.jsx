import { useState } from 'react';
import PropTypes from 'prop-types';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import Button from './Button';

const Calendar = ({
  value = new Date(),
  onChange,
  events = [],
  onEventClick,
  minDate,
  maxDate,
  className = '',
  ...props
}) => {
  const [currentMonth, setCurrentMonth] = useState(value);

  // Get calendar days
  const getDays = () => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  };

  // Get events for a specific day
  const getDayEvents = (day) => {
    return events.filter((event) => isSameDay(new Date(event.date), day));
  };

  // Navigate to previous month
  const previousMonth = () => {
    const prevMonth = subMonths(currentMonth, 1);
    if (!minDate || prevMonth >= minDate) {
      setCurrentMonth(prevMonth);
    }
  };

  // Navigate to next month
  const nextMonth = () => {
    const nextMonth = addMonths(currentMonth, 1);
    if (!maxDate || nextMonth <= maxDate) {
      setCurrentMonth(nextMonth);
    }
  };

  // Handle date selection
  const handleDateClick = (day) => {
    if (onChange) {
      onChange(day);
    }
  };

  const days = getDays();

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow ${className}`} {...props}>
      {/* Calendar Header */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={previousMonth}
            disabled={minDate && subMonths(currentMonth, 1) < minDate}
          >
            <span className="sr-only">Previous month</span>
            <i className="fas fa-chevron-left" />
          </Button>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={nextMonth}
            disabled={maxDate && addMonths(currentMonth, 1) > maxDate}
          >
            <span className="sr-only">Next month</span>
            <i className="fas fa-chevron-right" />
          </Button>
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-1 mt-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div
              key={day}
              className="text-center text-sm font-medium text-gray-500 dark:text-gray-400"
            >
              {day}
            </div>
          ))}
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-4">
        <div className="grid grid-cols-7 gap-1">
          {days.map((day) => {
            const dayEvents = getDayEvents(day);
            const isSelected = value && isSameDay(day, value);
            const isToday = isSameDay(day, new Date());
            const isCurrentMonth = isSameMonth(day, currentMonth);

            return (
              <div
                key={day.toString()}
                className={`
                  relative h-24 p-1 border border-gray-200 dark:border-gray-700
                  ${isCurrentMonth ? '' : 'bg-gray-50 dark:bg-gray-900'}
                  ${isSelected ? 'border-primary-500' : ''}
                  ${isToday ? 'bg-primary-50 dark:bg-primary-900' : ''}
                `}
              >
                <button
                  type="button"
                  onClick={() => handleDateClick(day)}
                  className={`
                    w-6 h-6 flex items-center justify-center rounded-full
                    ${
                      isSelected
                        ? 'bg-primary-500 text-white'
                        : 'text-gray-700 dark:text-gray-300'
                    }
                    ${isCurrentMonth ? '' : 'text-gray-400 dark:text-gray-600'}
                  `}
                >
                  {format(day, 'd')}
                </button>

                {/* Events */}
                <div className="mt-1 space-y-1 overflow-y-auto max-h-16">
                  {dayEvents.map((event, index) => (
                    <button
                      key={index}
                      onClick={() => onEventClick && onEventClick(event)}
                      className={`
                        w-full text-left text-xs p-1 rounded
                        ${event.color || 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'}
                        truncate
                      `}
                      title={event.title}
                    >
                      {event.title}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

Calendar.propTypes = {
  value: PropTypes.instanceOf(Date),
  onChange: PropTypes.func,
  events: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,
      color: PropTypes.string
    })
  ),
  onEventClick: PropTypes.func,
  minDate: PropTypes.instanceOf(Date),
  maxDate: PropTypes.instanceOf(Date),
  className: PropTypes.string
};

// Mini Calendar Component
export const MiniCalendar = ({
  value = new Date(),
  onChange,
  className = '',
  ...props
}) => {
  const [currentMonth, setCurrentMonth] = useState(value);

  const days = getDays();

  function getDays() {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow ${className}`} {...props}>
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <i className="fas fa-chevron-left" />
          </button>
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {format(currentMonth, 'MMMM yyyy')}
          </span>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <i className="fas fa-chevron-right" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center mb-1">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
            <div
              key={day}
              className="text-xs font-medium text-gray-500 dark:text-gray-400"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((day) => {
            const isSelected = value && isSameDay(day, value);
            const isToday = isSameDay(day, new Date());
            const isCurrentMonth = isSameMonth(day, currentMonth);

            return (
              <button
                key={day.toString()}
                onClick={() => onChange && onChange(day)}
                className={`
                  w-7 h-7 flex items-center justify-center text-sm rounded-full
                  ${
                    isSelected
                      ? 'bg-primary-500 text-white'
                      : isToday
                      ? 'bg-primary-50 text-primary-600 dark:bg-primary-900 dark:text-primary-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }
                  ${isCurrentMonth ? '' : 'text-gray-400 dark:text-gray-600'}
                `}
              >
                {format(day, 'd')}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

MiniCalendar.propTypes = {
  value: PropTypes.instanceOf(Date),
  onChange: PropTypes.func,
  className: PropTypes.string
};

export default Calendar;