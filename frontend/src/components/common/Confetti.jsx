import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

const Confetti = ({
  active = false,
  config = {},
  className = '',
  ...props
}) => {
  const canvasRef = useRef(null);
  const [particles, setParticles] = useState([]);
  const animationFrameId = useRef(null);

  // Default configuration
  const defaultConfig = {
    particleCount: 100,
    spread: 70,
    startVelocity: 30,
    decay: 0.9,
    gravity: 1,
    drift: 0,
    ticks: 200,
    colors: [
      '#26ccff',
      '#a25afd',
      '#ff5e7e',
      '#88ff5a',
      '#fcff42',
      '#ffa62d',
      '#ff36ff'
    ],
    shapes: ['square', 'circle'],
    scalar: 1
  };

  // Merge default config with provided config
  const finalConfig = { ...defaultConfig, ...config };

  // Create a particle
  const createParticle = (x, y) => {
    const angle = Math.random() * 2 * Math.PI;
    const velocity = (Math.random() * finalConfig.startVelocity) * finalConfig.scalar;

    return {
      x,
      y,
      wobble: Math.random() * 10,
      velocity: {
        x: Math.cos(angle) * velocity + finalConfig.drift,
        y: Math.sin(angle) * velocity
      },
      color: finalConfig.colors[Math.floor(Math.random() * finalConfig.colors.length)],
      shape: finalConfig.shapes[Math.floor(Math.random() * finalConfig.shapes.length)],
      tick: 0,
      totalTicks: finalConfig.ticks,
      decay: finalConfig.decay,
      random: Math.random() + 2,
      tiltAngle: Math.random() * Math.PI
    };
  };

  // Initialize particles
  const initParticles = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const newParticles = Array.from({ length: finalConfig.particleCount }, () => {
      const x = centerX + ((Math.random() - 0.5) * finalConfig.spread * rect.width);
      const y = centerY + ((Math.random() - 0.5) * finalConfig.spread * rect.height);
      return createParticle(x, y);
    });

    setParticles(newParticles);
  };

  // Update particle positions
  const updateParticles = () => {
    setParticles(prevParticles =>
      prevParticles
        .map(particle => {
          particle.x += particle.velocity.x;
          particle.y += particle.velocity.y;
          particle.velocity.x *= particle.decay;
          particle.velocity.y *= particle.decay;
          particle.velocity.y += finalConfig.gravity;
          particle.tick += 1;
          particle.tiltAngle += 0.1;
          particle.wobble += 0.1;
          return particle;
        })
        .filter(particle => particle.tick < particle.totalTicks)
    );
  };

  // Draw particles
  const drawParticles = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(particle => {
      const opacity = (particle.totalTicks - particle.tick) / particle.totalTicks;
      ctx.save();
      ctx.translate(particle.x, particle.y);
      ctx.rotate(particle.tiltAngle);
      ctx.scale(particle.random, particle.random);

      ctx.fillStyle = `${particle.color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`;

      if (particle.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, 4, 0, 2 * Math.PI);
        ctx.fill();
      } else {
        ctx.fillRect(-4, -4, 8, 8);
      }

      ctx.restore();
    });
  };

  // Animation loop
  const animate = () => {
    updateParticles();
    drawParticles();

    if (particles.length > 0) {
      animationFrameId.current = requestAnimationFrame(animate);
    }
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (!canvasRef.current) return;

      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle active state changes
  useEffect(() => {
    if (active) {
      initParticles();
    } else {
      setParticles([]);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    }
  }, [active]);

  // Start animation when particles change
  useEffect(() => {
    if (particles.length > 0) {
      animate();
    }
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [particles]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-50 ${className}`}
      {...props}
    />
  );
};

Confetti.propTypes = {
  active: PropTypes.bool,
  config: PropTypes.shape({
    particleCount: PropTypes.number,
    spread: PropTypes.number,
    startVelocity: PropTypes.number,
    decay: PropTypes.number,
    gravity: PropTypes.number,
    drift: PropTypes.number,
    ticks: PropTypes.number,
    colors: PropTypes.arrayOf(PropTypes.string),
    shapes: PropTypes.arrayOf(PropTypes.string),
    scalar: PropTypes.number
  }),
  className: PropTypes.string
};

// Celebration Component
export const Celebration = ({
  trigger = false,
  duration = 3000,
  onComplete,
  ...props
}) => {
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (trigger && !active) {
      setActive(true);
      const timer = setTimeout(() => {
        setActive(false);
        onComplete?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [trigger, duration, onComplete]);

  return <Confetti active={active} {...props} />;
};

Celebration.propTypes = {
  trigger: PropTypes.bool,
  duration: PropTypes.number,
  onComplete: PropTypes.func
};

export default Confetti;