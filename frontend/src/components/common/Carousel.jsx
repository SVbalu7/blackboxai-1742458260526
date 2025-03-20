import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

const Carousel = ({
  slides,
  autoPlay = false,
  interval = 5000,
  showDots = true,
  showArrows = true,
  infinite = true,
  effect = 'slide',
  className = '',
  ...props
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);

  // Handle next slide
  const nextSlide = useCallback(() => {
    if (infinite || currentSlide < slides.length - 1) {
      setCurrentSlide((prev) => 
        prev === slides.length - 1 ? 0 : prev + 1
      );
    }
  }, [currentSlide, slides.length, infinite]);

  // Handle previous slide
  const prevSlide = () => {
    if (infinite || currentSlide > 0) {
      setCurrentSlide((prev) => 
        prev === 0 ? slides.length - 1 : prev - 1
      );
    }
  };

  // Handle dot click
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Auto play functionality
  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(nextSlide, interval);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, interval, nextSlide]);

  // Effect classes
  const effectClasses = {
    slide: 'transition-transform duration-500 transform',
    fade: 'transition-opacity duration-500',
    zoom: 'transition-all duration-500 transform'
  };

  // Effect styles
  const getEffectStyles = (index) => {
    switch (effect) {
      case 'slide':
        return {
          transform: `translateX(-${currentSlide * 100}%)`
        };
      case 'fade':
        return {
          opacity: index === currentSlide ? 1 : 0,
          position: index === currentSlide ? 'relative' : 'absolute',
          inset: 0
        };
      case 'zoom':
        return {
          opacity: index === currentSlide ? 1 : 0,
          transform: index === currentSlide ? 'scale(1)' : 'scale(0.9)',
          position: index === currentSlide ? 'relative' : 'absolute',
          inset: 0
        };
      default:
        return {};
    }
  };

  return (
    <div
      className={`
        relative overflow-hidden rounded-lg
        ${className}
      `}
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(autoPlay)}
      {...props}
    >
      {/* Slides */}
      <div className="relative h-full">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`
              w-full h-full
              ${effectClasses[effect]}
            `}
            style={getEffectStyles(index)}
          >
            {typeof slide === 'string' ? (
              <img
                src={slide}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover"
              />
            ) : (
              slide
            )}
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {showArrows && slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className={`
              absolute left-4 top-1/2 -translate-y-1/2
              p-2 rounded-full
              bg-black/30 hover:bg-black/50
              text-white
              transition-colors
              ${!infinite && currentSlide === 0 ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            disabled={!infinite && currentSlide === 0}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className={`
              absolute right-4 top-1/2 -translate-y-1/2
              p-2 rounded-full
              bg-black/30 hover:bg-black/50
              text-white
              transition-colors
              ${!infinite && currentSlide === slides.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            disabled={!infinite && currentSlide === slides.length - 1}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Dots */}
      {showDots && slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`
                w-2 h-2 rounded-full transition-colors
                ${index === currentSlide
                  ? 'bg-white'
                  : 'bg-white/50 hover:bg-white/75'
                }
              `}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

Carousel.propTypes = {
  slides: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.node])
  ).isRequired,
  autoPlay: PropTypes.bool,
  interval: PropTypes.number,
  showDots: PropTypes.bool,
  showArrows: PropTypes.bool,
  infinite: PropTypes.bool,
  effect: PropTypes.oneOf(['slide', 'fade', 'zoom']),
  className: PropTypes.string
};

// Thumbnail Carousel Component
export const ThumbnailCarousel = ({
  slides,
  thumbnailPosition = 'bottom',
  className = '',
  ...props
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <div
      className={`
        flex
        ${thumbnailPosition === 'left' || thumbnailPosition === 'right'
          ? 'flex-row space-x-4'
          : 'flex-col space-y-4'
        }
        ${className}
      `}
      {...props}
    >
      {/* Main Carousel */}
      <div className="flex-1">
        <Carousel
          slides={slides}
          showDots={false}
          currentSlide={currentSlide}
          onSlideChange={setCurrentSlide}
        />
      </div>

      {/* Thumbnails */}
      <div
        className={`
          flex
          ${thumbnailPosition === 'left' || thumbnailPosition === 'right'
            ? 'flex-col space-y-2'
            : 'flex-row space-x-2'
          }
        `}
      >
        {slides.map((slide, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`
              relative overflow-hidden rounded
              ${thumbnailPosition === 'left' || thumbnailPosition === 'right'
                ? 'w-20 h-20'
                : 'w-16 h-16'
              }
              ${index === currentSlide
                ? 'ring-2 ring-primary-500'
                : 'opacity-50 hover:opacity-75'
              }
              transition-all
            `}
          >
            {typeof slide === 'string' ? (
              <img
                src={slide}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            ) : (
              slide
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

ThumbnailCarousel.propTypes = {
  slides: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.node])
  ).isRequired,
  thumbnailPosition: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
  className: PropTypes.string
};

export default Carousel;