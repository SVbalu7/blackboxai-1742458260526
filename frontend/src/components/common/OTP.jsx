import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

const OTP = ({
  length = 6,
  value = '',
  onChange,
  autoFocus = true,
  disabled = false,
  error,
  type = 'number',
  inputMode = 'numeric',
  renderSeparator,
  className = '',
  ...props
}) => {
  const [otp, setOtp] = useState(value.split(''));
  const inputRefs = useRef([]);

  // Initialize input refs
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);

  // Focus first input on mount
  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  // Update value when prop changes
  useEffect(() => {
    setOtp(value.split(''));
  }, [value]);

  // Handle input change
  const handleChange = (e, index) => {
    const newValue = e.target.value;
    const newOtp = [...otp];

    // Handle paste
    if (newValue.length > 1) {
      const pastedValue = newValue.slice(0, length - index);
      for (let i = 0; i < pastedValue.length; i++) {
        if (index + i < length) {
          newOtp[index + i] = pastedValue[i];
        }
      }
      setOtp(newOtp);
      onChange?.(newOtp.join(''));
      
      // Focus last input or next empty input
      const nextIndex = Math.min(index + pastedValue.length, length - 1);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    // Handle single character input
    if (type === 'number' && !/^\d*$/.test(newValue)) return;
    newOtp[index] = newValue;
    setOtp(newOtp);
    onChange?.(newOtp.join(''));

    // Focus next input
    if (newValue && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      // Focus previous input on backspace
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      // Focus previous input on left arrow
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      // Focus next input on right arrow
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  return (
    <div className={className} {...props}>
      <div className="flex items-center justify-center space-x-2">
        {Array.from({ length }, (_, index) => (
          <>
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type={type}
              inputMode={inputMode}
              pattern={type === 'number' ? '[0-9]*' : undefined}
              maxLength={1}
              value={otp[index] || ''}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              disabled={disabled}
              className={`
                w-12 h-12
                text-center text-2xl
                border rounded-lg
                focus:outline-none focus:ring-2
                transition-colors
                ${error
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 dark:border-gray-600 focus:border-primary-500 focus:ring-primary-500'
                }
                ${disabled
                  ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed'
                  : 'bg-white dark:bg-gray-900'
                }
              `}
            />
            {renderSeparator && index < length - 1 && renderSeparator(index)}
          </>
        ))}
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
};

OTP.propTypes = {
  length: PropTypes.number,
  value: PropTypes.string,
  onChange: PropTypes.func,
  autoFocus: PropTypes.bool,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  type: PropTypes.oneOf(['text', 'number', 'password']),
  inputMode: PropTypes.oneOf(['text', 'numeric', 'tel', 'decimal']),
  renderSeparator: PropTypes.func,
  className: PropTypes.string
};

// OTP Field Component
export const OTPField = ({
  label,
  helperText,
  ...props
}) => {
  return (
    <div>
      {label && (
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          {label}
        </label>
      )}
      <OTP {...props} />
      {helperText && !props.error && (
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {helperText}
        </p>
      )}
    </div>
  );
};

OTPField.propTypes = {
  label: PropTypes.string,
  helperText: PropTypes.string
};

// OTP Timer Component
export const OTPTimer = ({
  duration = 60,
  onExpire,
  onResend,
  className = '',
  ...props
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setTimeLeft((time) => {
        if (time <= 1) {
          clearInterval(timer);
          setIsActive(false);
          onExpire?.();
          return 0;
        }
        return time - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, onExpire]);

  const handleResend = () => {
    onResend?.();
    setTimeLeft(duration);
    setIsActive(true);
  };

  return (
    <div className={`text-sm ${className}`} {...props}>
      {isActive ? (
        <p className="text-gray-500 dark:text-gray-400">
          Resend code in {timeLeft} seconds
        </p>
      ) : (
        <button
          type="button"
          onClick={handleResend}
          className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
        >
          Resend code
        </button>
      )}
    </div>
  );
};

OTPTimer.propTypes = {
  duration: PropTypes.number,
  onExpire: PropTypes.func,
  onResend: PropTypes.func,
  className: PropTypes.string
};

export default OTP;