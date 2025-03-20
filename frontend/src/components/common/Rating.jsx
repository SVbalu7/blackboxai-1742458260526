import { useState } from 'react';
import PropTypes from 'prop-types';

const Rating = ({
  value = 0,
  onChange,
  max = 5,
  size = 'md',
  color = 'primary',
  readOnly = false,
  showValue = false,
  precision = 1,
  emptyIcon = '☆',
  fullIcon = '★',
  halfIcon = '★',
  className = '',
  ...props
}) => {
  const [hoverValue, setHoverValue] = useState(null);

  // Size classes
  const sizeClasses = {
    sm: 'text-lg space-x-0.5',
    md: 'text-2xl space-x-1',
    lg: 'text-3xl space-x-1.5'
  };

  // Color classes
  const colorClasses = {
    primary: 'text-primary-500 hover:text-primary-600',
    secondary: 'text-gray-500 hover:text-gray-600',
    success: 'text-green-500 hover:text-green-600',
    warning: 'text-yellow-500 hover:text-yellow-600',
    danger: 'text-red-500 hover:text-red-600'
  };

  // Generate array of rating values based on precision
  const ratingValues = Array.from(
    { length: max * (1 / precision) },
    (_, i) => (i + 1) * precision
  );

  // Get the appropriate icon for a rating value
  const getIcon = (ratingValue) => {
    const currentValue = hoverValue ?? value;
    if (currentValue >= ratingValue) return fullIcon;
    if (currentValue + 0.5 === ratingValue && precision <= 0.5) return halfIcon;
    return emptyIcon;
  };

  // Handle mouse enter on star
  const handleMouseEnter = (ratingValue) => {
    if (!readOnly) {
      setHoverValue(ratingValue);
    }
  };

  // Handle mouse leave
  const handleMouseLeave = () => {
    setHoverValue(null);
  };

  // Handle click on star
  const handleClick = (ratingValue) => {
    if (!readOnly) {
      onChange(ratingValue === value ? 0 : ratingValue);
    }
  };

  return (
    <div className={`inline-flex items-center ${className}`} {...props}>
      <div
        className={`flex ${sizeClasses[size]}`}
        onMouseLeave={handleMouseLeave}
      >
        {ratingValues.map((ratingValue) => (
          <span
            key={ratingValue}
            className={`
              cursor-default
              ${!readOnly ? 'cursor-pointer' : ''}
              ${colorClasses[color]}
              transition-colors duration-150
            `}
            onClick={() => handleClick(ratingValue)}
            onMouseEnter={() => handleMouseEnter(ratingValue)}
            role={!readOnly ? 'button' : undefined}
            tabIndex={!readOnly ? 0 : undefined}
          >
            {getIcon(ratingValue)}
          </span>
        ))}
      </div>
      {showValue && (
        <span className="ml-2 text-gray-600 dark:text-gray-400">
          {value.toFixed(precision === 1 ? 0 : 1)}
        </span>
      )}
    </div>
  );
};

Rating.propTypes = {
  value: PropTypes.number,
  onChange: PropTypes.func,
  max: PropTypes.number,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  color: PropTypes.oneOf(['primary', 'secondary', 'success', 'warning', 'danger']),
  readOnly: PropTypes.bool,
  showValue: PropTypes.bool,
  precision: PropTypes.oneOf([0.1, 0.2, 0.25, 0.5, 1]),
  emptyIcon: PropTypes.string,
  fullIcon: PropTypes.string,
  halfIcon: PropTypes.string,
  className: PropTypes.string
};

// Heart Rating Component
export const HeartRating = (props) => {
  return (
    <Rating
      emptyIcon="♡"
      fullIcon="♥"
      halfIcon="♥"
      color="danger"
      {...props}
    />
  );
};

// Emoji Rating Component
export const EmojiRating = ({
  showLabels = false,
  labels = ['Terrible', 'Bad', 'Okay', 'Good', 'Excellent'],
  ...props
}) => {
  const emojis = ['😡', '😕', '😐', '😊', '😍'];

  return (
    <div className="inline-flex flex-col items-center">
      <Rating
        emptyIcon="⚪"
        fullIcon={emojis[Math.floor((props.value || 0) - 0.5)]}
        showValue={false}
        {...props}
      />
      {showLabels && props.value > 0 && (
        <span className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          {labels[Math.floor(props.value - 1)]}
        </span>
      )}
    </div>
  );
};

EmojiRating.propTypes = {
  showLabels: PropTypes.bool,
  labels: PropTypes.arrayOf(PropTypes.string),
  value: PropTypes.number
};

// Interactive Rating Component
export const InteractiveRating = ({
  onSubmit,
  showSubmit = true,
  submitLabel = 'Submit',
  ...props
}) => {
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (rating > 0) {
      onSubmit(rating);
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="text-center">
        <div className="text-4xl mb-2">🎉</div>
        <p className="text-gray-600 dark:text-gray-400">
          Thanks for your rating!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <Rating
        value={rating}
        onChange={setRating}
        {...props}
      />
      {showSubmit && (
        <button
          onClick={handleSubmit}
          disabled={rating === 0}
          className={`
            px-4 py-2 rounded-md
            ${rating > 0
              ? 'bg-primary-600 text-white hover:bg-primary-700'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }
            transition-colors duration-150
          `}
        >
          {submitLabel}
        </button>
      )}
    </div>
  );
};

InteractiveRating.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  showSubmit: PropTypes.bool,
  submitLabel: PropTypes.string
};

export default Rating;