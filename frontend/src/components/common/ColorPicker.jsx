import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

const ColorPicker = ({
  value = '#000000',
  onChange,
  format = 'hex',
  presetColors = [],
  showInput = true,
  showPresets = true,
  disabled = false,
  className = '',
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentColor, setCurrentColor] = useState(value);
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(100);
  const [lightness, setLightness] = useState(50);
  const containerRef = useRef(null);

  // Convert color formats
  const hexToHsl = (hex) => {
    let r = parseInt(hex.slice(1, 3), 16) / 255;
    let g = parseInt(hex.slice(3, 5), 16) / 255;
    let b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return [h * 360, s * 100, l * 100];
  };

  const hslToHex = (h, s, l) => {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  // Initialize color values
  useEffect(() => {
    const [h, s, l] = hexToHsl(value);
    setHue(h);
    setSaturation(s);
    setLightness(l);
  }, [value]);

  // Handle color change
  const handleColorChange = (h, s, l) => {
    const hex = hslToHex(h, s, l);
    setCurrentColor(hex);
    onChange?.(hex);
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`} {...props}>
      {/* Color Preview */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`
          w-10 h-10 rounded-lg
          border border-gray-200 dark:border-gray-700
          ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
        `}
        style={{ backgroundColor: currentColor }}
      />

      {/* Color Input */}
      {showInput && (
        <input
          type="text"
          value={currentColor}
          onChange={(e) => {
            const color = e.target.value;
            if (/^#[0-9A-F]{6}$/i.test(color)) {
              setCurrentColor(color);
              onChange?.(color);
            }
          }}
          className={`
            ml-2 w-24 px-2 py-1
            border border-gray-200 dark:border-gray-700 rounded
            text-sm text-gray-900 dark:text-white
            bg-white dark:bg-gray-800
            ${disabled ? 'cursor-not-allowed opacity-50' : ''}
          `}
          disabled={disabled}
        />
      )}

      {/* Color Picker Popup */}
      {isOpen && !disabled && (
        <div className="
          absolute z-50 mt-2
          bg-white dark:bg-gray-800
          border border-gray-200 dark:border-gray-700
          rounded-lg shadow-lg
          p-4
        ">
          {/* Saturation/Lightness Picker */}
          <div
            className="w-48 h-48 relative rounded cursor-pointer"
            style={{
              backgroundColor: `hsl(${hue}, 100%, 50%)`
            }}
            onClick={(e) => {
              const rect = e.target.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              const s = (x / rect.width) * 100;
              const l = 100 - (y / rect.height) * 100;
              setSaturation(s);
              setLightness(l);
              handleColorChange(hue, s, l);
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
            <div
              className="absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2 border-2 border-white rounded-full"
              style={{
                left: `${saturation}%`,
                top: `${100 - lightness}%`
              }}
            />
          </div>

          {/* Hue Slider */}
          <div
            className="h-4 mt-4 rounded cursor-pointer"
            style={{
              background: 'linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)'
            }}
            onClick={(e) => {
              const rect = e.target.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const h = (x / rect.width) * 360;
              setHue(h);
              handleColorChange(h, saturation, lightness);
            }}
          >
            <div
              className="absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2 bg-white border-2 border-gray-200 rounded-full"
              style={{ left: `${(hue / 360) * 100}%`, top: '50%' }}
            />
          </div>

          {/* Preset Colors */}
          {showPresets && presetColors.length > 0 && (
            <div className="mt-4 grid grid-cols-8 gap-1">
              {presetColors.map((color, index) => (
                <button
                  key={index}
                  className="w-6 h-6 rounded-full border border-gray-200 dark:border-gray-700"
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    setCurrentColor(color);
                    onChange?.(color);
                    setIsOpen(false);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

ColorPicker.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  format: PropTypes.oneOf(['hex', 'rgb', 'hsl']),
  presetColors: PropTypes.arrayOf(PropTypes.string),
  showInput: PropTypes.bool,
  showPresets: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string
};

// Color Swatch Component
export const ColorSwatch = ({
  color,
  size = 'md',
  shape = 'square',
  onClick,
  className = '',
  ...props
}) => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };

  const shapes = {
    square: 'rounded-lg',
    circle: 'rounded-full'
  };

  return (
    <div
      className={`
        ${sizes[size]}
        ${shapes[shape]}
        border border-gray-200 dark:border-gray-700
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      style={{ backgroundColor: color }}
      onClick={onClick}
      {...props}
    />
  );
};

ColorSwatch.propTypes = {
  color: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  shape: PropTypes.oneOf(['square', 'circle']),
  onClick: PropTypes.func,
  className: PropTypes.string
};

export default ColorPicker;