import { useState, Fragment } from 'react';
import { Combobox as HeadlessCombobox, Transition } from '@headlessui/react';
import PropTypes from 'prop-types';

const Combobox = ({
  value,
  onChange,
  options,
  displayValue,
  placeholder = 'Select an option',
  disabled = false,
  error,
  size = 'md',
  loading = false,
  multiple = false,
  creatable = false,
  onCreateOption,
  className = '',
  ...props
}) => {
  const [query, setQuery] = useState('');

  // Filter options based on search query
  const filteredOptions = query === ''
    ? options
    : options.filter((option) =>
        (typeof displayValue === 'function' ? displayValue(option) : option)
          .toLowerCase()
          .includes(query.toLowerCase())
      );

  // Size classes
  const sizeClasses = {
    sm: 'h-8 text-sm',
    md: 'h-10 text-base',
    lg: 'h-12 text-lg'
  };

  return (
    <div className={className}>
      <HeadlessCombobox
        value={value}
        onChange={onChange}
        multiple={multiple}
        disabled={disabled}
        {...props}
      >
        <div className="relative">
          <div
            className={`
              relative w-full cursor-default overflow-hidden
              rounded-lg bg-white dark:bg-gray-800
              border border-gray-300 dark:border-gray-600
              ${error ? 'border-red-500 dark:border-red-500' : ''}
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              focus-within:border-primary-500 dark:focus-within:border-primary-500
              focus-within:ring-1 focus-within:ring-primary-500
              ${sizeClasses[size]}
            `}
          >
            <HeadlessCombobox.Input
              className={`
                w-full border-none
                bg-transparent pl-3 pr-10
                text-gray-900 dark:text-white
                focus:outline-none focus:ring-0
                ${sizeClasses[size]}
              `}
              displayValue={(selected) => {
                if (multiple) {
                  return selected.map(item => 
                    typeof displayValue === 'function' ? displayValue(item) : item
                  ).join(', ');
                }
                return typeof displayValue === 'function' ? displayValue(selected) : selected;
              }}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={placeholder}
            />
            <HeadlessCombobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              {loading ? (
                <div className="animate-spin h-5 w-5 text-gray-400">
                  <i className="fas fa-spinner" />
                </div>
              ) : (
                <svg
                  className="h-5 w-5 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 7l3-3 3 3m0 6l-3 3-3-3"
                  />
                </svg>
              )}
            </HeadlessCombobox.Button>
          </div>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery('')}
          >
            <HeadlessCombobox.Options
              className="
                absolute z-10 mt-1 max-h-60 w-full overflow-auto
                rounded-md bg-white dark:bg-gray-800
                py-1 text-base
                shadow-lg ring-1 ring-black ring-opacity-5
                focus:outline-none
              "
            >
              {filteredOptions.length === 0 && query !== '' ? (
                <div className="relative cursor-default select-none py-2 px-4 text-gray-700 dark:text-gray-300">
                  {creatable ? (
                    <button
                      className="w-full text-left text-primary-600 dark:text-primary-400 hover:text-primary-700"
                      onClick={() => onCreateOption && onCreateOption(query)}
                    >
                      Create "{query}"
                    </button>
                  ) : (
                    'Nothing found.'
                  )}
                </div>
              ) : (
                filteredOptions.map((option, index) => (
                  <HeadlessCombobox.Option
                    key={index}
                    className={({ active }) => `
                      relative cursor-default select-none py-2 pl-10 pr-4
                      ${active
                        ? 'bg-primary-600 text-white'
                        : 'text-gray-900 dark:text-white'
                      }
                    `}
                    value={option}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? 'font-medium' : 'font-normal'
                          }`}
                        >
                          {typeof displayValue === 'function'
                            ? displayValue(option)
                            : option}
                        </span>
                        {selected && (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                              active ? 'text-white' : 'text-primary-600'
                            }`}
                          >
                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </span>
                        )}
                      </>
                    )}
                  </HeadlessCombobox.Option>
                ))
              )}
            </HeadlessCombobox.Options>
          </Transition>
        </div>
      </HeadlessCombobox>

      {/* Error Message */}
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
};

Combobox.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  displayValue: PropTypes.func,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  loading: PropTypes.bool,
  multiple: PropTypes.bool,
  creatable: PropTypes.bool,
  onCreateOption: PropTypes.func,
  className: PropTypes.string
};

// Async Combobox Component
export const AsyncCombobox = ({
  loadOptions,
  debounce = 300,
  ...props
}) => {
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);

  // Debounced search
  let debounceTimer;
  const handleSearch = async (query) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    debounceTimer = setTimeout(async () => {
      setLoading(true);
      try {
        const results = await loadOptions(query);
        setOptions(results);
      } catch (error) {
        console.error('Error loading options:', error);
      } finally {
        setLoading(false);
      }
    }, debounce);
  };

  return (
    <Combobox
      {...props}
      options={options}
      loading={loading}
      onSearch={handleSearch}
    />
  );
};

AsyncCombobox.propTypes = {
  loadOptions: PropTypes.func.isRequired,
  debounce: PropTypes.number
};

// Multi-select Combobox Component
export const MultiCombobox = (props) => {
  return <Combobox multiple {...props} />;
};

export default Combobox;