import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

const Slider = ({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  showTooltip = true,
  showInput = false,
  size = 'md',
  color = 'primary',
  marks = [],
  range = false,
  className = '',
  ...props
}) => {
  // For range slider
  const [values, setValues] = useState(range ? [value[0], value[1]] : [value]);
  const [isDragging, setIsDragging] = useState(false);
  const [activeThumb, setActiveThumb] = useState(null);
  const trackRef = useRef(null);

  // Size classes
  const sizeClasses = {
    sm: {
      track: 'h-1',
      thumb: 'h-3 w-3',
      mark: 'h-2 w-2',
      text: 'text-xs'
    },
    md: {
      track: 'h-2',
      thumb: 'h-4 w-4',
      mark: 'h-2.5 w-2.5',
      text: 'text-sm'
    },
    lg: {
      track: 'h-3',
      thumb: 'h-5 w-5',
      mark: 'h-3 w-3',
      text: 'text-base'
    }
  };

  // Color classes
  const colorClasses = {
    primary: {
      track: 'bg-primary-600',
      thumb: 'bg-primary-600 border-primary-600',
      hover: 'hover:bg-primary-700'
    },
    secondary: {
      track: 'bg-gray-600',
      thumb: 'bg-gray-600 border-gray-600',
      hover: 'hover:bg-gray-700'
    },
    success: {
      track: 'bg-green-600',
      thumb: 'bg-green-600 border-green-600',
      hover: 'hover:bg-green-700'
    },
    danger: {
      track: 'bg-red-600',
      thumb: 'bg-red-600 border-red-600',
      hover: 'hover:bg-red-700'
    }
  };

  // Calculate percentage for a value
  const getPercentage = (value) => {
    return ((value - min) / (max - min)) * 100;
  };

  // Calculate value from percentage
  const getValueFromPercentage = (percentage) => {
    const rawValue = ((percentage / 100) * (max - min)) + min;
    const steppedValue = Math.round(rawValue / step) * step;
    return Math.min(Math.max(steppedValue, min), max);
  };

  // Handle mouse/touch events
  const handleInteraction = (event) => {
    if (disabled) return;

    const rect = trackRef.current.getBoundingClientRect();
    const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    const percentage = ((clientX - rect.left) / rect.width) * 100;
    const newValue = getValueFromPercentage(percentage);

    if (range) {
      // Find closest thumb for range slider
      const thumb1Distance = Math.abs(values[0] - newValue);
      const thumb2Distance = Math.abs(values[1] - newValue);
      const newActiveThumb = thumb1Distance < thumb2Distance ? 0 : 1;
      setActiveThumb(newActiveThumb);

      const newValues = [...values];
      newValues[newActiveThumb] = newValue;

      // Ensure values don't cross
      if (newActiveThumb === 0 && newValue > values[1]) {
        newValues[0] = values[1];
      } else if (newActiveThumb === 1 && newValue < values[0]) {
        newValues[1] = values[0];
      }

      setValues(newValues);
      onChange(newValues);
    } else {
      setValues([newValue]);
      onChange(newValue);
    }
  };

  // Format value for display
  const formatValue = (value) => {
    return Number.isInteger(value) ? value : value.toFixed(1);
  };

  return (
    <div className={`relative ${className}`} {...props}>
      {/* Track */}
      <div
        ref={trackRef}
        className={`
          relative
          ${sizeClasses[size].track}
          rounded-full
          bg-gray-200 dark:bg-gray-700
          cursor-pointer
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onClick={handleInteraction}
        onTouchStart={() => setIsDragging(true)}
        onTouchMove={handleInteraction}
        onTouchEnd={() => setIsDragging(false)}
        onMouseDown={() => setIsDragging(true)}
        onMouseMove={isDragging ? handleInteraction : null}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
      >
        {/* Filled Track */}
        <div
          className={`
            absolute h-full rounded-full
            ${colorClasses[color].track}
          `}
          style={{
            left: `${range ? getPercentage(Math.min(...values)) : 0}%`,
            width: `${range
              ? getPercentage(Math.max(...values)) - getPercentage(Math.min(...values))
              : getPercentage(values[0])
            }%`
          }}
        />

        {/* Marks */}
        {marks.map((mark, index) => (
          <div
            key={index}
            className={`
              absolute top-1/2 -translate-y-1/2
              ${sizeClasses[size].mark}
              rounded-full
              bg-gray-400 dark:bg-gray-500
              transform -translate-x-1/2
              ${mark.value <= values[0] ? colorClasses[color].track : ''}
            `}
            style={{ left: `${getPercentage(mark.value)}%` }}
          >
            {mark.label && (
              <div
                className={`
                  absolute -bottom-6
                  transform -translate-x-1/2
                  ${sizeClasses[size].text}
                  text-gray-600 dark:text-gray-400
                `}
                style={{ left: '50%' }}
              >
                {mark.label}
              </div>
            )}
          </div>
        ))}

        {/* Thumbs */}
        {values.map((value, index) => (
          <div
            key={index}
            className={`
              absolute top-1/2 -translate-y-1/2
              ${sizeClasses[size].thumb}
              rounded-full
              border-2
              ${colorClasses[color].thumb}
              ${colorClasses[color].hover}
              transform -translate-x-1/2
              transition-shadow
              cursor-grab
              ${isDragging && activeThumb === index ? 'cursor-grabbing shadow-lg' : ''}
              ${disabled ? 'cursor-not-allowed' : ''}
            `}
            style={{ left: `${getPercentage(value)}%` }}
          >
            {/* Tooltip */}
            {showTooltip && (isDragging || !range) && (
              <div
                className={`
                  absolute -top-8
                  transform -translate-x-1/2
                  px-2 py-1
                  bg-gray-900 dark:bg-gray-700
                  text-white
                  rounded
                  ${sizeClasses[size].text}
                `}
                style={{ left: '50%' }}
              >
                {formatValue(value)}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input */}
      {showInput && (
        <div className="mt-4 flex items-center space-x-4">
          {range ? (
            <>
              <input
                type="number"
                value={values[0]}
                onChange={(e) => {
                  const newValues = [Number(e.target.value), values[1]];
                  setValues(newValues);
                  onChange(newValues);
                }}
                min={min}
                max={values[1]}
                step={step}
                disabled={disabled}
                className="w-20 px-2 py-1 rounded border"
              />
              <span>to</span>
              <input
                type="number"
                value={values[1]}
                onChange={(e) => {
                  const newValues = [values[0], Number(e.target.value)];
                  setValues(newValues);
                  onChange(newValues);
                }}
                min={values[0]}
                max={max}
                step={step}
                disabled={disabled}
                className="w-20 px-2 py-1 rounded border"
              />
            </>
          ) : (
            <input
              type="number"
              value={values[0]}
              onChange={(e) => {
                const newValue = Number(e.target.value);
                setValues([newValue]);
                onChange(newValue);
              }}
              min={min}
              max={max}
              step={step}
              disabled={disabled}
              className="w-20 px-2 py-1 rounded border"
            />
          )}
        </div>
      )}
    </div>
  );
};

Slider.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.arrayOf(PropTypes.number)
  ]).isRequired,
  onChange: PropTypes.func.isRequired,
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  disabled: PropTypes.bool,
  showTooltip: PropTypes.bool,
  showInput: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  color: PropTypes.oneOf(['primary', 'secondary', 'success', 'danger']),
  marks: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.number.isRequired,
      label: PropTypes.string
    })
  ),
  range: PropTypes.bool,
  className: PropTypes.string
};

export default Slider;