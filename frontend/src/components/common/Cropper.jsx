import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

const Cropper = ({
  src,
  onChange,
  aspect,
  minWidth = 100,
  minHeight = 100,
  maxWidth,
  maxHeight,
  guides = true,
  preview,
  disabled = false,
  className = '',
  ...props
}) => {
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const [crop, setCrop] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  // Initialize crop area when image loads
  useEffect(() => {
    const image = new Image();
    image.src = src;
    image.onload = () => {
      const { width, height } = image;
      setImageSize({ width, height });

      // Calculate initial crop area
      let cropWidth = Math.min(width, maxWidth || width);
      let cropHeight = aspect ? cropWidth / aspect : Math.min(height, maxHeight || height);

      if (cropHeight > height) {
        cropHeight = height;
        cropWidth = aspect ? cropHeight * aspect : cropWidth;
      }

      setCrop({
        x: (width - cropWidth) / 2,
        y: (height - cropHeight) / 2,
        width: cropWidth,
        height: cropHeight
      });
    };
  }, [src, aspect, maxWidth, maxHeight]);

  // Handle mouse down
  const handleMouseDown = (e, type = 'move') => {
    if (disabled) return;

    const container = containerRef.current.getBoundingClientRect();
    const offsetX = e.clientX - container.left;
    const offsetY = e.clientY - container.top;

    if (type === 'move') {
      setDragging({ offsetX: offsetX - crop.x, offsetY: offsetY - crop.y });
    } else {
      setResizing({ type, offsetX, offsetY });
    }
  };

  // Handle mouse move
  const handleMouseMove = (e) => {
    if (disabled || (!dragging && !resizing)) return;

    const container = containerRef.current.getBoundingClientRect();
    const x = e.clientX - container.left;
    const y = e.clientY - container.top;

    if (dragging) {
      const newX = Math.max(0, Math.min(x - dragging.offsetX, imageSize.width - crop.width));
      const newY = Math.max(0, Math.min(y - dragging.offsetY, imageSize.height - crop.height));

      setCrop((prev) => ({
        ...prev,
        x: newX,
        y: newY
      }));
    }

    if (resizing) {
      let newCrop = { ...crop };

      switch (resizing.type) {
        case 'nw':
          newCrop = {
            ...newCrop,
            x: Math.min(crop.x + crop.width - minWidth, x),
            y: Math.min(crop.y + crop.height - minHeight, y),
            width: crop.x + crop.width - x,
            height: crop.y + crop.height - y
          };
          break;
        case 'ne':
          newCrop = {
            ...newCrop,
            y: Math.min(crop.y + crop.height - minHeight, y),
            width: x - crop.x,
            height: crop.y + crop.height - y
          };
          break;
        case 'sw':
          newCrop = {
            ...newCrop,
            x: Math.min(crop.x + crop.width - minWidth, x),
            width: crop.x + crop.width - x,
            height: y - crop.y
          };
          break;
        case 'se':
          newCrop = {
            ...newCrop,
            width: x - crop.x,
            height: y - crop.y
          };
          break;
      }

      // Apply aspect ratio constraint
      if (aspect) {
        if (['nw', 'se'].includes(resizing.type)) {
          newCrop.height = newCrop.width / aspect;
        } else {
          newCrop.width = newCrop.height * aspect;
        }
      }

      // Apply size constraints
      newCrop.width = Math.max(minWidth, Math.min(newCrop.width, maxWidth || imageSize.width));
      newCrop.height = Math.max(minHeight, Math.min(newCrop.height, maxHeight || imageSize.height));

      setCrop(newCrop);
    }
  };

  // Handle mouse up
  const handleMouseUp = () => {
    if (dragging || resizing) {
      setDragging(false);
      setResizing(null);
      onChange?.(getCropData());
    }
  };

  // Get crop data
  const getCropData = () => {
    const canvas = document.createElement('canvas');
    canvas.width = crop.width;
    canvas.height = crop.height;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(
      imageRef.current,
      crop.x,
      crop.y,
      crop.width,
      crop.height,
      0,
      0,
      crop.width,
      crop.height
    );

    return {
      x: crop.x,
      y: crop.y,
      width: crop.width,
      height: crop.height,
      dataUrl: canvas.toDataURL()
    };
  };

  return (
    <div className={`relative ${className}`} {...props}>
      {/* Container */}
      <div
        ref={containerRef}
        className="relative overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Image */}
        <img
          ref={imageRef}
          src={src}
          alt="Crop"
          className="max-w-full"
          draggable={false}
        />

        {/* Crop Area */}
        <div
          className={`
            absolute border-2 border-white
            ${disabled ? 'cursor-not-allowed' : 'cursor-move'}
          `}
          style={{
            top: crop.y,
            left: crop.x,
            width: crop.width,
            height: crop.height,
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)'
          }}
          onMouseDown={(e) => handleMouseDown(e)}
        >
          {/* Guides */}
          {guides && !disabled && (
            <>
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="border border-white/30" />
                ))}
              </div>
              <div className="absolute inset-0 border-2 border-white/30" />
            </>
          )}

          {/* Resize Handles */}
          {!disabled && (
            <>
              <div
                className="absolute -left-2 -top-2 w-4 h-4 bg-white rounded-full cursor-nw-resize"
                onMouseDown={(e) => handleMouseDown(e, 'nw')}
              />
              <div
                className="absolute -right-2 -top-2 w-4 h-4 bg-white rounded-full cursor-ne-resize"
                onMouseDown={(e) => handleMouseDown(e, 'ne')}
              />
              <div
                className="absolute -left-2 -bottom-2 w-4 h-4 bg-white rounded-full cursor-sw-resize"
                onMouseDown={(e) => handleMouseDown(e, 'sw')}
              />
              <div
                className="absolute -right-2 -bottom-2 w-4 h-4 bg-white rounded-full cursor-se-resize"
                onMouseDown={(e) => handleMouseDown(e, 'se')}
              />
            </>
          )}
        </div>
      </div>

      {/* Preview */}
      {preview && (
        <div className="mt-4">
          <div
            className="overflow-hidden"
            style={{ width: preview.width, height: preview.height }}
          >
            <img
              src={src}
              alt="Preview"
              style={{
                width: imageSize.width,
                height: imageSize.height,
                transform: `translate(${-crop.x}px, ${-crop.y}px)`
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

Cropper.propTypes = {
  src: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  aspect: PropTypes.number,
  minWidth: PropTypes.number,
  minHeight: PropTypes.number,
  maxWidth: PropTypes.number,
  maxHeight: PropTypes.number,
  guides: PropTypes.bool,
  preview: PropTypes.shape({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
  }),
  disabled: PropTypes.bool,
  className: PropTypes.string
};

export default Cropper;