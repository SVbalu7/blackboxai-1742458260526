import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

const Editor = ({
  value,
  onChange,
  placeholder = 'Start typing...',
  toolbar = 'full',
  height = '300px',
  readOnly = false,
  className = '',
  ...props
}) => {
  const [editor, setEditor] = useState(null);
  const [isReady, setIsReady] = useState(false);

  // Initialize editor
  useEffect(() => {
    const init = async () => {
      try {
        // Dynamically import TinyMCE
        const tinymce = await import('tinymce');
        await import('tinymce/themes/silver');
        await import('tinymce/icons/default');
        await import('tinymce/models/dom');

        // Import plugins
        await import('tinymce/plugins/advlist');
        await import('tinymce/plugins/autolink');
        await import('tinymce/plugins/lists');
        await import('tinymce/plugins/link');
        await import('tinymce/plugins/image');
        await import('tinymce/plugins/charmap');
        await import('tinymce/plugins/preview');
        await import('tinymce/plugins/anchor');
        await import('tinymce/plugins/searchreplace');
        await import('tinymce/plugins/visualblocks');
        await import('tinymce/plugins/code');
        await import('tinymce/plugins/fullscreen');
        await import('tinymce/plugins/insertdatetime');
        await import('tinymce/plugins/media');
        await import('tinymce/plugins/table');
        await import('tinymce/plugins/help');
        await import('tinymce/plugins/wordcount');

        // Initialize editor
        tinymce.init({
          target: document.getElementById('editor'),
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'help', 'wordcount'
          ],
          toolbar: getToolbarConfig(toolbar),
          menubar: toolbar === 'full',
          statusbar: toolbar === 'full',
          height,
          placeholder,
          readonly: readOnly,
          content_style: `
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              font-size: 16px;
              color: #374151;
            }
            body.dark {
              background-color: #1f2937;
              color: #e5e7eb;
            }
          `,
          setup: (ed) => {
            setEditor(ed);
            ed.on('init', () => {
              setIsReady(true);
              ed.setContent(value || '');
            });
            ed.on('change', () => {
              onChange(ed.getContent());
            });
          }
        });
      } catch (error) {
        console.error('Error initializing editor:', error);
      }
    };

    init();

    return () => {
      if (editor) {
        editor.destroy();
      }
    };
  }, []);

  // Update content when value prop changes
  useEffect(() => {
    if (editor && isReady && value !== editor.getContent()) {
      editor.setContent(value || '');
    }
  }, [value, editor, isReady]);

  // Get toolbar configuration based on type
  const getToolbarConfig = (type) => {
    switch (type) {
      case 'full':
        return 'undo redo | formatselect | bold italic backcolor | \
                alignleft aligncenter alignright alignjustify | \
                bullist numlist outdent indent | removeformat | help';
      case 'basic':
        return 'bold italic | alignleft aligncenter alignright | bullist numlist';
      case 'minimal':
        return 'bold italic';
      default:
        return type; // Custom toolbar configuration
    }
  };

  return (
    <div className={`relative ${className}`} {...props}>
      <textarea
        id="editor"
        style={{ visibility: 'hidden' }}
      />
    </div>
  );
};

Editor.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  toolbar: PropTypes.oneOfType([
    PropTypes.oneOf(['full', 'basic', 'minimal']),
    PropTypes.string
  ]),
  height: PropTypes.string,
  readOnly: PropTypes.bool,
  className: PropTypes.string
};

// Simple Editor Component
export const SimpleEditor = ({
  value,
  onChange,
  placeholder = 'Start typing...',
  className = '',
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  // Handle formatting
  const handleFormat = (command) => {
    document.execCommand(command, false, null);
  };

  return (
    <div className={`relative ${className}`} {...props}>
      {/* Toolbar */}
      <div className={`
        flex items-center space-x-2 p-2
        border-b border-gray-200 dark:border-gray-700
        ${isFocused ? 'bg-gray-50 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'}
      `}>
        <button
          type="button"
          onClick={() => handleFormat('bold')}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
        >
          <i className="fas fa-bold" />
        </button>
        <button
          type="button"
          onClick={() => handleFormat('italic')}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
        >
          <i className="fas fa-italic" />
        </button>
        <button
          type="button"
          onClick={() => handleFormat('underline')}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
        >
          <i className="fas fa-underline" />
        </button>
        <div className="h-4 w-px bg-gray-200 dark:bg-gray-700" />
        <button
          type="button"
          onClick={() => handleFormat('insertUnorderedList')}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
        >
          <i className="fas fa-list-ul" />
        </button>
        <button
          type="button"
          onClick={() => handleFormat('insertOrderedList')}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
        >
          <i className="fas fa-list-ol" />
        </button>
      </div>

      {/* Content */}
      <div
        contentEditable
        onInput={(e) => onChange(e.target.innerHTML)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        dangerouslySetInnerHTML={{ __html: value }}
        placeholder={placeholder}
        className={`
          p-4 min-h-[200px]
          focus:outline-none
          ${!value && 'before:content-[attr(placeholder)] before:text-gray-400'}
        `}
      />
    </div>
  );
};

SimpleEditor.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  className: PropTypes.string
};

// Markdown Editor Component
export const MarkdownEditor = ({
  value,
  onChange,
  preview = false,
  className = '',
  ...props
}) => {
  // Convert markdown to HTML (basic implementation)
  const markdownToHtml = useCallback((markdown) => {
    return markdown
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/\n/g, '<br>');
  }, []);

  return (
    <div className={`flex ${preview ? 'space-x-4' : ''} ${className}`} {...props}>
      {/* Editor */}
      <div className={preview ? 'w-1/2' : 'w-full'}>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="
            w-full h-full min-h-[300px] p-4
            bg-white dark:bg-gray-900
            border border-gray-200 dark:border-gray-700
            rounded-lg
            focus:outline-none focus:ring-2 focus:ring-primary-500
            font-mono text-sm
          "
        />
      </div>

      {/* Preview */}
      {preview && (
        <div
          className="
            w-1/2 min-h-[300px] p-4
            bg-white dark:bg-gray-900
            border border-gray-200 dark:border-gray-700
            rounded-lg
            prose dark:prose-invert
            max-w-none
          "
          dangerouslySetInnerHTML={{ __html: markdownToHtml(value) }}
        />
      )}
    </div>
  );
};

MarkdownEditor.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  preview: PropTypes.bool,
  className: PropTypes.string
};

export default Editor;