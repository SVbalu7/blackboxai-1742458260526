import { Fragment, useState, useEffect } from 'react';
import { Dialog, Combobox, Transition } from '@headlessui/react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const CommandPalette = ({
  isOpen,
  onClose,
  commands = [],
  placeholder = 'Type a command or search...',
  maxResults = 10,
  showShortcuts = true,
  className = '',
  ...props
}) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  // Filter commands based on search query
  const filteredCommands = query === ''
    ? commands
    : commands.filter((command) => {
        const searchTerms = [
          command.name,
          command.description,
          ...(command.keywords || [])
        ].filter(Boolean).join(' ').toLowerCase();
        
        return searchTerms.includes(query.toLowerCase());
      }).slice(0, maxResults);

  // Handle command selection
  const handleSelect = (command) => {
    if (command.action) {
      command.action();
    } else if (command.href) {
      navigate(command.href);
    }
    onClose();
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          onClose(true);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20"
        onClose={onClose}
        {...props}
      >
        {/* Overlay */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Dialog.Overlay className="fixed inset-0 bg-gray-500/75 dark:bg-gray-900/75 transition-opacity" />
        </Transition.Child>

        {/* Command palette panel */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Dialog.Panel
            className={`
              mx-auto max-w-2xl transform divide-y divide-gray-200 dark:divide-gray-700
              overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-2xl
              ring-1 ring-black ring-opacity-5 transition-all
              ${className}
            `}
          >
            <Combobox onChange={handleSelect}>
              {/* Search input */}
              <div className="relative">
                <i className="fas fa-search pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
                <Combobox.Input
                  className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-0 sm:text-sm"
                  placeholder={placeholder}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </div>

              {/* Results */}
              {filteredCommands.length > 0 && (
                <Combobox.Options
                  static
                  className="max-h-80 scroll-py-2 divide-y divide-gray-200 dark:divide-gray-700 overflow-y-auto"
                >
                  {/* Group commands by category */}
                  {Object.entries(
                    filteredCommands.reduce((acc, command) => {
                      const category = command.category || 'General';
                      if (!acc[category]) acc[category] = [];
                      acc[category].push(command);
                      return acc;
                    }, {})
                  ).map(([category, commands]) => (
                    <div key={category} className="p-2">
                      <h2 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400">
                        {category}
                      </h2>
                      <div className="mt-2 space-y-1">
                        {commands.map((command) => (
                          <Combobox.Option
                            key={command.id}
                            value={command}
                            className={({ active }) => `
                              flex items-center justify-between
                              rounded-lg px-3 py-2
                              cursor-pointer select-none
                              ${active
                                ? 'bg-primary-600 text-white'
                                : 'text-gray-900 dark:text-white'
                              }
                            `}
                          >
                            {({ active }) => (
                              <>
                                <div className="flex items-center">
                                  {command.icon && (
                                    <span className={`
                                      mr-3 h-5 w-5
                                      ${active
                                        ? 'text-white'
                                        : 'text-gray-500 dark:text-gray-400'
                                      }
                                    `}>
                                      {command.icon}
                                    </span>
                                  )}
                                  <div>
                                    <div className="font-medium">
                                      {command.name}
                                    </div>
                                    {command.description && (
                                      <div className={`
                                        text-sm
                                        ${active
                                          ? 'text-primary-100'
                                          : 'text-gray-500 dark:text-gray-400'
                                        }
                                      `}>
                                        {command.description}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                {showShortcuts && command.shortcut && (
                                  <div className={`
                                    ml-3 flex-shrink-0 text-sm
                                    ${active
                                      ? 'text-primary-100'
                                      : 'text-gray-500 dark:text-gray-400'
                                    }
                                  `}>
                                    {command.shortcut}
                                  </div>
                                )}
                              </>
                            )}
                          </Combobox.Option>
                        ))}
                      </div>
                    </div>
                  ))}
                </Combobox.Options>
              )}

              {/* Empty state */}
              {query && filteredCommands.length === 0 && (
                <div className="py-14 px-6 text-center sm:px-14">
                  <i className="fas fa-search-minus mx-auto h-6 w-6 text-gray-400 dark:text-gray-500" />
                  <p className="mt-4 text-sm text-gray-900 dark:text-white">
                    No commands found for "{query}"
                  </p>
                </div>
              )}
            </Combobox>
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition.Root>
  );
};

CommandPalette.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  commands: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string,
      category: PropTypes.string,
      icon: PropTypes.node,
      action: PropTypes.func,
      href: PropTypes.string,
      shortcut: PropTypes.string,
      keywords: PropTypes.arrayOf(PropTypes.string)
    })
  ),
  placeholder: PropTypes.string,
  maxResults: PropTypes.number,
  showShortcuts: PropTypes.bool,
  className: PropTypes.string
};

// Quick Actions Component
export const QuickActions = ({
  actions,
  trigger,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {trigger({
        onClick: () => setIsOpen(true)
      })}
      <CommandPalette
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        commands={actions}
        {...props}
      />
    </>
  );
};

QuickActions.propTypes = {
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      action: PropTypes.func.isRequired,
      icon: PropTypes.node
    })
  ).isRequired,
  trigger: PropTypes.func.isRequired
};

export default CommandPalette;