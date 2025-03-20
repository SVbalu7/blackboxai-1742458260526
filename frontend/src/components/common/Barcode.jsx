import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import QRCode from 'qrcode';
import JsBarcode from 'jsbarcode';

const Barcode = ({
  value,
  type = 'qr',
  options = {},
  width = 200,
  height = 200,
  foreground = '#000000',
  background = '#ffffff',
  className = '',
  ...props
}) => {
  const canvasRef = useRef(null);

  // Generate barcode/QR code
  useEffect(() => {
    if (!value) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    if (type === 'qr') {
      QRCode.toCanvas(canvas, value, {
        width,
        margin: 1,
        color: {
          dark: foreground,
          light: background
        },
        ...options
      });
    } else {
      JsBarcode(canvas, value, {
        width: 2,
        height,
        displayValue: true,
        background,
        lineColor: foreground,
        margin: 10,
        ...options
      });
    }
  }, [value, type, width, height, foreground, background, options]);

  return (
    <canvas
      ref={canvasRef}
      className={`max-w-full ${className}`}
      {...props}
    />
  );
};

Barcode.propTypes = {
  value: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['qr', 'code128', 'ean13', 'ean8', 'upc']),
  options: PropTypes.object,
  width: PropTypes.number,
  height: PropTypes.number,
  foreground: PropTypes.string,
  background: PropTypes.string,
  className: PropTypes.string
};

// QR Code Component
export const QRCode = ({
  value,
  size = 200,
  level = 'M',
  includeMargin = true,
  ...props
}) => {
  return (
    <Barcode
      value={value}
      type="qr"
      width={size}
      height={size}
      options={{
        errorCorrectionLevel: level,
        margin: includeMargin ? 4 : 0
      }}
      {...props}
    />
  );
};

QRCode.propTypes = {
  value: PropTypes.string.isRequired,
  size: PropTypes.number,
  level: PropTypes.oneOf(['L', 'M', 'Q', 'H']),
  includeMargin: PropTypes.bool
};

// Barcode Scanner Component
export const BarcodeScanner = ({
  onDetect,
  onError,
  width = 400,
  height = 300,
  scanInterval = 100,
  className = '',
  ...props
}) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const intervalRef = useRef(null);

  // Start scanner
  const startScanner = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      
      streamRef.current = stream;
      const video = videoRef.current;
      video.srcObject = stream;
      await video.play();

      // Start scanning
      intervalRef.current = setInterval(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        
        // Draw video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Get image data
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        
        // Here you would integrate with a barcode detection library
        // For example, using zxing-js/library or other barcode scanning libraries
        // This is a placeholder for the actual barcode detection logic
        try {
          // const result = barcodeDetectionLibrary.detect(imageData);
          // if (result) {
          //   onDetect?.(result);
          // }
        } catch (error) {
          onError?.(error);
        }
      }, scanInterval);
    } catch (error) {
      onError?.(error);
    }
  };

  // Stop scanner
  const stopScanner = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => stopScanner();
  }, []);

  return (
    <div className={`relative ${className}`} {...props}>
      {/* Video Preview */}
      <video
        ref={videoRef}
        className="w-full rounded-lg"
        style={{ maxWidth: width, maxHeight: height }}
      />

      {/* Hidden Canvas for Processing */}
      <canvas
        ref={canvasRef}
        className="hidden"
        width={width}
        height={height}
      />

      {/* Scanning Overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-3/4 h-1/2">
          {/* Corner Markers */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary-500" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary-500" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary-500" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary-500" />

          {/* Scanning Line Animation */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-x-0 h-0.5 bg-primary-500 animate-scan" />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-4 flex justify-center space-x-4">
        <button
          type="button"
          onClick={startScanner}
          className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
        >
          Start Scanning
        </button>
        <button
          type="button"
          onClick={stopScanner}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          Stop Scanning
        </button>
      </div>
    </div>
  );
};

BarcodeScanner.propTypes = {
  onDetect: PropTypes.func,
  onError: PropTypes.func,
  width: PropTypes.number,
  height: PropTypes.number,
  scanInterval: PropTypes.number,
  className: PropTypes.string
};

export default Barcode;