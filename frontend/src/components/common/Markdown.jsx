import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypePrism from 'rehype-prism-plus';
import 'katex/dist/katex.min.css';
import 'prismjs/themes/prism-tomorrow.css';

const Markdown = ({
  content,
  className = '',
  ...props
}) => {
  return (
    <div className={`prose dark:prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex, rehypePrism]}
        components={{
          // Custom components for markdown elements
          h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mb-4" {...props} />,
          h2: ({ node, ...props }) => <h2 className="text-2xl font-bold mb-3" {...props} />,
          h3: ({ node, ...props }) => <h3 className="text-xl font-bold mb-2" {...props} />,
          h4: ({ node, ...props }) => <h4 className="text-lg font-bold mb-2" {...props} />,
          p: ({ node, ...props }) => <p className="mb-4" {...props} />,
          a: ({ node, ...props }) => (
            <a
              className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
              {...props}
            />
          ),
          ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-4" {...props} />,
          ol: ({ node, ...props }) => <ol className="list-decimal pl-6 mb-4" {...props} />,
          li: ({ node, ...props }) => <li className="mb-1" {...props} />,
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="border-l-4 border-gray-200 dark:border-gray-700 pl-4 italic mb-4"
              {...props}
            />
          ),
          code: ({ node, inline, ...props }) => (
            inline ? (
              <code
                className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-sm"
                {...props}
              />
            ) : (
              <code
                className="block p-4 rounded bg-gray-100 dark:bg-gray-800 text-sm overflow-x-auto"
                {...props}
              />
            )
          ),
          pre: ({ node, ...props }) => (
            <pre className="mb-4 rounded overflow-x-auto" {...props} />
          ),
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700" {...props} />
            </div>
          ),
          th: ({ node, ...props }) => (
            <th
              className="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              {...props}
            />
          ),
          td: ({ node, ...props }) => (
            <td className="px-6 py-4 whitespace-nowrap text-sm" {...props} />
          ),
          img: ({ node, ...props }) => (
            <img className="rounded-lg max-w-full h-auto" {...props} />
          )
        }}
        {...props}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

Markdown.propTypes = {
  content: PropTypes.string.isRequired,
  className: PropTypes.string
};

// Markdown Editor Component
export const MarkdownEditor = ({
  value,
  onChange,
  preview = true,
  height = '400px',
  placeholder = 'Write your markdown here...',
  disabled = false,
  className = '',
  ...props
}) => {
  const [showPreview, setShowPreview] = useState(preview);

  return (
    <div className={`border border-gray-200 dark:border-gray-700 rounded-lg ${className}`} {...props}>
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700">
        <div className="flex space-x-2">
          {/* Basic Formatting */}
          <button
            type="button"
            onClick={() => onChange?.(`${value}**bold**`)}
            disabled={disabled}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <i className="fas fa-bold" />
          </button>
          <button
            type="button"
            onClick={() => onChange?.(`${value}*italic*`)}
            disabled={disabled}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <i className="fas fa-italic" />
          </button>
          <div className="w-px h-4 bg-gray-200 dark:bg-gray-700" />
          {/* Lists */}
          <button
            type="button"
            onClick={() => onChange?.(`${value}\n- List item`)}
            disabled={disabled}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <i className="fas fa-list-ul" />
          </button>
          <button
            type="button"
            onClick={() => onChange?.(`${value}\n1. List item`)}
            disabled={disabled}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <i className="fas fa-list-ol" />
          </button>
          <div className="w-px h-4 bg-gray-200 dark:bg-gray-700" />
          {/* Links and Images */}
          <button
            type="button"
            onClick={() => onChange?.(`${value}[link text](url)`)}
            disabled={disabled}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <i className="fas fa-link" />
          </button>
          <button
            type="button"
            onClick={() => onChange?.(`${value}![alt text](image-url)`)}
            disabled={disabled}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <i className="fas fa-image" />
          </button>
        </div>
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          {showPreview ? 'Hide Preview' : 'Show Preview'}
        </button>
      </div>

      <div className={`flex ${showPreview ? 'divide-x divide-gray-200 dark:divide-gray-700' : ''}`}>
        {/* Editor */}
        <div className={showPreview ? 'w-1/2' : 'w-full'}>
          <textarea
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className={`
              w-full p-4
              bg-transparent
              text-gray-900 dark:text-white
              placeholder-gray-500 dark:placeholder-gray-400
              focus:outline-none
              resize-none
              disabled:cursor-not-allowed disabled:opacity-50
            `}
            style={{ height }}
          />
        </div>

        {/* Preview */}
        {showPreview && (
          <div className="w-1/2 p-4 overflow-auto" style={{ height }}>
            <Markdown content={value} />
          </div>
        )}
      </div>
    </div>
  );
};

MarkdownEditor.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  preview: PropTypes.bool,
  height: PropTypes.string,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string
};

export default Markdown;
