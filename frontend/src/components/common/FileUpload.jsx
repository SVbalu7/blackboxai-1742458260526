import { useRef, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';

const FileUpload = ({
  accept,
  multiple = false,
  maxSize = 5242880, // 5MB
  maxFiles = 5,
  value = [],
  onChange,
  onError,
  preview = true,
  disabled = false,
  className = '',
  ...props
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Handle file drop
  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    // Handle rejected files
    if (rejectedFiles.length > 0) {
      rejectedFiles.forEach((file) => {
        const error = file.errors[0];
        const errorMessage = error.code === 'file-too-large'
          ? `File is too large. Max size is ${maxSize / 1024 / 1024}MB`
          : error.message;
        onError && onError(errorMessage);
      });
      return;
    }

    // Handle accepted files
    const newFiles = multiple
      ? [...value, ...acceptedFiles].slice(0, maxFiles)
      : [acceptedFiles[0]];

    onChange(newFiles);
  }, [value, multiple, maxFiles, maxSize, onChange, onError]);

  // Setup dropzone
  const { getRootProps, getInputProps } = useDropzone({
    accept,
    multiple,
    maxSize,
    maxFiles,
    disabled,
    onDrop,
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
    onDropAccepted: () => setIsDragging(false),
    onDropRejected: () => setIsDragging(false)
  });

  // Remove file
  const handleRemove = (index) => {
    const newFiles = [...value];
    newFiles.splice(index, 1);
    onChange(newFiles);
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Get file icon based on type
  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return 'fa-image';
    if (type.startsWith('video/')) return 'fa-video';
    if (type.startsWith('audio/')) return 'fa-music';
    if (type.includes('pdf')) return 'fa-file-pdf';
    if (type.includes('word')) return 'fa-file-word';
    if (type.includes('excel')) return 'fa-file-excel';
    if (type.includes('powerpoint')) return 'fa-file-powerpoint';
    return 'fa-file';
  };

  return (
    <div className={className} {...props}>
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`
          relative p-6 border-2 border-dashed rounded-lg
          ${isDragging
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
            : 'border-gray-300 dark:border-gray-700'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <input {...getInputProps()} ref={fileInputRef} />
        <div className="text-center">
          <i className="fas fa-cloud-upload-alt text-4xl text-gray-400 dark:text-gray-600 mb-4" />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {isDragging ? (
              'Drop files here...'
            ) : (
              <>
                Drag & drop files here, or{' '}
                <span className="text-primary-600 dark:text-primary-400">browse</span>
              </>
            )}
          </p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
            {multiple
              ? `Up to ${maxFiles} files, max ${maxSize / 1024 / 1024}MB each`
              : `Max file size: ${maxSize / 1024 / 1024}MB`
            }
          </p>
        </div>
      </div>

      {/* File List */}
      {value.length > 0 && (
        <ul className="mt-4 space-y-2">
          {value.map((file, index) => (
            <li
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <i className={`fas ${getFileIcon(file.type)} text-gray-400`} />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>

              {/* Preview for images */}
              {preview && file.type.startsWith('image/') && (
                <div className="flex items-center space-x-2">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="h-10 w-10 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
                  >
                    <i className="fas fa-trash-alt" />
                  </button>
                </div>
              )}

              {/* Remove button for non-images */}
              {(!preview || !file.type.startsWith('image/')) && (
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
                >
                  <i className="fas fa-trash-alt" />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

FileUpload.propTypes = {
  accept: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string)),
  multiple: PropTypes.bool,
  maxSize: PropTypes.number,
  maxFiles: PropTypes.number,
  value: PropTypes.arrayOf(PropTypes.instanceOf(File)),
  onChange: PropTypes.func.isRequired,
  onError: PropTypes.func,
  preview: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string
};

// Image Upload Component
export const ImageUpload = ({
  value,
  onChange,
  aspectRatio = '1:1',
  maxSize = 5242880,
  className = '',
  ...props
}) => {
  return (
    <FileUpload
      accept={{
        'image/*': ['.png', '.jpg', '.jpeg', '.gif']
      }}
      maxSize={maxSize}
      value={value}
      onChange={onChange}
      preview={true}
      className={`
        ${aspectRatio === '1:1' ? 'aspect-square' : ''}
        ${aspectRatio === '16:9' ? 'aspect-video' : ''}
        ${aspectRatio === '4:3' ? 'aspect-4/3' : ''}
        ${className}
      `}
      {...props}
    />
  );
};

ImageUpload.propTypes = {
  value: PropTypes.arrayOf(PropTypes.instanceOf(File)),
  onChange: PropTypes.func.isRequired,
  aspectRatio: PropTypes.oneOf(['1:1', '16:9', '4:3']),
  maxSize: PropTypes.number,
  className: PropTypes.string
};

// Document Upload Component
export const DocumentUpload = ({
  value,
  onChange,
  maxSize = 10485760, // 10MB
  className = '',
  ...props
}) => {
  return (
    <FileUpload
      accept={{
        'application/pdf': ['.pdf'],
        'application/msword': ['.doc'],
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
        'application/vnd.ms-excel': ['.xls'],
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
      }}
      maxSize={maxSize}
      value={value}
      onChange={onChange}
      preview={false}
      className={className}
      {...props}
    />
  );
};

DocumentUpload.propTypes = {
  value: PropTypes.arrayOf(PropTypes.instanceOf(File)),
  onChange: PropTypes.func.isRequired,
  maxSize: PropTypes.number,
  className: PropTypes.string
};

export default FileUpload;