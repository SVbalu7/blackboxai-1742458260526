import { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const Signature = ({
  value,
  onChange,
  width = 400,
  height = 200,
  lineWidth = 2,
  lineColor = '#000000',
  backgroundColor = '#ffffff',
  disabled = false,
  readOnly = false,
  className = '',
  ...props
}) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastX, setLastX] = useState(0);
  const [lastY, setLastY] = useState(0);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Set canvas size
    canvas.width = width;
    canvas.height = height;

    // Set canvas background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    // Load existing signature
    if (value) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
      };
      img.src = value;
    }
  }, [width, height, backgroundColor, value]);

  // Drawing functions
  const startDrawing = (e) => {
    if (disabled || readOnly) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    setLastX(x);
    setLastY(y);
  };

  const draw = (e) => {
    if (!isDrawing || disabled || readOnly) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.stroke();

    setLastX(x);
    setLastY(y);
  };

  const endDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      onChange?.(canvasRef.current.toDataURL());
    }
  };

  // Touch event handlers
  const handleTouchStart = (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    startDrawing({
      clientX: touch.clientX,
      clientY: touch.clientY
    });
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    draw({
      clientX: touch.clientX,
      clientY: touch.clientY
    });
  };

  const handleTouchEnd = (e) => {
    e.preventDefault();
    endDrawing();
  };

  // Clear signature
  const clear = () => {
    if (disabled || readOnly) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);
    onChange?.('');
  };

  // Download signature
  const download = () => {
    const link = document.createElement('a');
    link.download = 'signature.png';
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  return (
    <div className={`inline-block ${className}`} {...props}>
      <div className="relative">
        {/* Canvas */}
        <canvas
          ref={canvasRef}
          className={`
            border border-gray-200 dark:border-gray-700 rounded-lg
            ${disabled ? 'opacity-50 cursor-not-allowed' : readOnly ? 'cursor-default' : 'cursor-crosshair'}
          `}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          onMouseOut={endDrawing}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />

        {/* Actions */}
        {!readOnly && (
          <div className="absolute top-2 right-2 flex space-x-2">
            <button
              type="button"
              onClick={clear}
              disabled={disabled}
              className={`
                p-2 rounded-lg
                bg-white dark:bg-gray-800
                text-gray-500 dark:text-gray-400
                hover:bg-gray-100 dark:hover:bg-gray-700
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <i className="fas fa-eraser" />
            </button>
            <button
              type="button"
              onClick={download}
              disabled={disabled || !value}
              className={`
                p-2 rounded-lg
                bg-white dark:bg-gray-800
                text-gray-500 dark:text-gray-400
                hover:bg-gray-100 dark:hover:bg-gray-700
                ${(disabled || !value) ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <i className="fas fa-download" />
            </button>
          </div>
        )}
      </div>

      {/* Instructions */}
      {!readOnly && !disabled && (
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 text-center">
          Sign above using mouse or touch
        </p>
      )}
    </div>
  );
};

Signature.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  width: PropTypes.number,
  height: PropTypes.number,
  lineWidth: PropTypes.number,
  lineColor: PropTypes.string,
  backgroundColor: PropTypes.string,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  className: PropTypes.string
};

// Signature Field Component
export const SignatureField = ({
  label,
  required,
  error,
  helperText,
  ...props
}) => {
  return (
    <div>
      {label && (
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <Signature {...props} />
      {(error || helperText) && (
        <p className={`mt-2 text-sm ${error ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};

SignatureField.propTypes = {
  label: PropTypes.string,
  required: PropTypes.bool,
  error: PropTypes.string,
  helperText: PropTypes.string
};

// Signature Preview Component
export const SignaturePreview = ({
  value,
  size = 'md',
  ...props
}) => {
  const sizes = {
    sm: { width: 200, height: 100 },
    md: { width: 300, height: 150 },
    lg: { width: 400, height: 200 }
  };

  return (
    <Signature
      value={value}
      readOnly
      {...sizes[size]}
      {...props}
    />
  );
};

SignaturePreview.propTypes = {
  value: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['sm', 'md', 'lg'])
};

export default Signature;