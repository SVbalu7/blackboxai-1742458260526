import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Portal from './Portal';

const Lightbox = ({
  images,
  initialIndex = 0,
  isOpen,
  onClose,
  showThumbnails = true,
  showCaption = true,
  showCount = true,
  enableZoom = true,
  enableFullscreen = true,
  enableDownload = false,
  className = '',
  ...props
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Reset state when lightbox opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setIsZoomed(false);
    }
  }, [isOpen, initialIndex]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowLeft':
          navigate('prev');
          break;
        case 'ArrowRight':
          navigate('next');
          break;
        case 'Escape':
          onClose();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Navigation
  const navigate = (direction) => {
    if (isZoomed) return;

    setCurrentIndex((prevIndex) => {
      if (direction === 'next') {
        return prevIndex === images.length - 1 ? 0 : prevIndex + 1;
      }
      return prevIndex === 0 ? images.length - 1 : prevIndex - 1;
    });
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Download current image
  const downloadImage = () => {
    const link = document.createElement('a');
    link.href = images[currentIndex].src;
    link.download = images[currentIndex].title || 'image';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  return (
    <Portal containerId="lightbox-root">
      <div
        className={`
          fixed inset-0 z-50
          flex items-center justify-center
          bg-black bg-opacity-90
          ${className}
        `}
        onClick={onClose}
        {...props}
      >
        {/* Main Content */}
        <div
          className="relative max-w-full max-h-full p-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Image */}
          <div className="relative">
            <img
              src={images[currentIndex].src}
              alt={images[currentIndex].title || ''}
              className={`
                max-h-[80vh] max-w-[90vw]
                object-contain
                ${isZoomed ? 'cursor-zoom-out scale-150' : 'cursor-zoom-in'}
                transition-transform duration-200
              `}
              onClick={() => enableZoom && setIsZoomed(!isZoomed)}
            />

            {/* Navigation Buttons */}
            {!isZoomed && images.length > 1 && (
              <>
                <button
                  onClick={() => navigate('prev')}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/75"
                >
                  <i className="fas fa-chevron-left" />
                </button>
                <button
                  onClick={() => navigate('next')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/75"
                >
                  <i className="fas fa-chevron-right" />
                </button>
              </>
            )}
          </div>

          {/* Caption */}
          {showCaption && images[currentIndex].caption && (
            <div className="absolute bottom-16 left-0 right-0 text-center text-white p-4">
              <p className="text-lg">{images[currentIndex].caption}</p>
            </div>
          )}

          {/* Toolbar */}
          <div className="absolute top-4 right-4 flex space-x-2">
            {enableZoom && (
              <button
                onClick={() => setIsZoomed(!isZoomed)}
                className="p-2 rounded-full bg-black/50 text-white hover:bg-black/75"
              >
                <i className={`fas fa-${isZoomed ? 'search-minus' : 'search-plus'}`} />
              </button>
            )}
            {enableFullscreen && (
              <button
                onClick={toggleFullscreen}
                className="p-2 rounded-full bg-black/50 text-white hover:bg-black/75"
              >
                <i className={`fas fa-${isFullscreen ? 'compress' : 'expand'}`} />
              </button>
            )}
            {enableDownload && (
              <button
                onClick={downloadImage}
                className="p-2 rounded-full bg-black/50 text-white hover:bg-black/75"
              >
                <i className="fas fa-download" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-black/50 text-white hover:bg-black/75"
            >
              <i className="fas fa-times" />
            </button>
          </div>

          {/* Counter */}
          {showCount && images.length > 1 && (
            <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full">
              {currentIndex + 1} / {images.length}
            </div>
          )}

          {/* Thumbnails */}
          {showThumbnails && images.length > 1 && (
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex justify-center space-x-2 overflow-x-auto py-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`
                      relative flex-shrink-0
                      w-16 h-16
                      rounded-lg overflow-hidden
                      ${currentIndex === index ? 'ring-2 ring-primary-500' : 'opacity-50'}
                      transition-opacity duration-200
                      hover:opacity-100
                    `}
                  >
                    <img
                      src={image.thumbnail || image.src}
                      alt={image.title || ''}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Portal>
  );
};

Lightbox.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      src: PropTypes.string.isRequired,
      thumbnail: PropTypes.string,
      title: PropTypes.string,
      caption: PropTypes.string
    })
  ).isRequired,
  initialIndex: PropTypes.number,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  showThumbnails: PropTypes.bool,
  showCaption: PropTypes.bool,
  showCount: PropTypes.bool,
  enableZoom: PropTypes.bool,
  enableFullscreen: PropTypes.bool,
  enableDownload: PropTypes.bool,
  className: PropTypes.string
};

// Gallery Component
export const Gallery = ({
  images,
  columns = 3,
  gap = 4,
  className = '',
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleImageClick = (index) => {
    setSelectedIndex(index);
    setIsOpen(true);
  };

  return (
    <>
      <div
        className={`
          grid gap-${gap}
          grid-cols-1
          sm:grid-cols-2
          ${columns >= 3 ? 'lg:grid-cols-3' : ''}
          ${columns >= 4 ? 'xl:grid-cols-4' : ''}
          ${className}
        `}
        {...props}
      >
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => handleImageClick(index)}
            className="relative group overflow-hidden rounded-lg"
          >
            <img
              src={image.thumbnail || image.src}
              alt={image.title || ''}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            {image.title && (
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/75 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-white p-4">{image.title}</p>
              </div>
            )}
          </button>
        ))}
      </div>

      <Lightbox
        images={images}
        initialIndex={selectedIndex}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
};

Gallery.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      src: PropTypes.string.isRequired,
      thumbnail: PropTypes.string,
      title: PropTypes.string,
      caption: PropTypes.string
    })
  ).isRequired,
  columns: PropTypes.oneOf([1, 2, 3, 4]),
  gap: PropTypes.number,
  className: PropTypes.string
};

export default Lightbox;