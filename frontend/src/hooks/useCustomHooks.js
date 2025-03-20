import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import socketManager from '../utils/socket';
import { useAuth } from '../contexts/AuthContext';
import { debounce } from '../utils/helpers';

// Hook for handling async operations with loading and error states
export const useAsync = (asyncFunction, immediate = true) => {
  const [status, setStatus] = useState('idle');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...params) => {
    setStatus('pending');
    setData(null);
    setError(null);

    try {
      const response = await asyncFunction(...params);
      setData(response);
      setStatus('success');
      return response;
    } catch (error) {
      setError(error);
      setStatus('error');
      throw error;
    }
  }, [asyncFunction]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { execute, status, data, error, isLoading: status === 'pending' };
};

// Hook for handling form state and validation
export const useForm = (initialState = {}, validate) => {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const validateField = (name) => {
    if (validate) {
      const validationErrors = validate(values);
      setErrors(validationErrors);
      return !validationErrors[name];
    }
    return true;
  };

  const reset = () => {
    setValues(initialState);
    setErrors({});
    setTouched({});
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateField,
    reset,
    setValues,
    setErrors
  };
};

// Hook for handling socket connections and events
export const useSocket = (events = {}) => {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (user) {
      socketManager.connect(localStorage.getItem('token'));
      setIsConnected(true);

      // Register event listeners
      Object.entries(events).forEach(([event, handler]) => {
        socketManager.on(event, handler);
      });

      return () => {
        // Cleanup event listeners
        Object.entries(events).forEach(([event, handler]) => {
          socketManager.off(event, handler);
        });
        socketManager.disconnect();
        setIsConnected(false);
      };
    }
  }, [user, events]);

  return { socket: socketManager.getSocket(), isConnected };
};

// Hook for handling pagination
export const usePagination = (data = [], itemsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(1);
  const maxPage = Math.ceil(data.length / itemsPerPage);

  const currentData = () => {
    const begin = (currentPage - 1) * itemsPerPage;
    const end = begin + itemsPerPage;
    return data.slice(begin, end);
  };

  const next = () => {
    setCurrentPage(currentPage => Math.min(currentPage + 1, maxPage));
  };

  const prev = () => {
    setCurrentPage(currentPage => Math.max(currentPage - 1, 1));
  };

  const jump = (page) => {
    const pageNumber = Math.max(1, page);
    setCurrentPage(Math.min(pageNumber, maxPage));
  };

  return { next, prev, jump, currentData, currentPage, maxPage };
};

// Hook for handling infinite scroll
export const useInfiniteScroll = (callback, options = {}) => {
  const { threshold = 100, debounceMs = 100 } = options;
  const [isFetching, setIsFetching] = useState(false);
  const containerRef = useRef(null);

  const handleScroll = useCallback(debounce(() => {
    if (!containerRef.current || isFetching) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    if (scrollHeight - scrollTop - clientHeight < threshold) {
      setIsFetching(true);
    }
  }, debounceMs), [isFetching, threshold, debounceMs]);

  useEffect(() => {
    const currentRef = containerRef.current;
    if (currentRef) {
      currentRef.addEventListener('scroll', handleScroll);
      return () => currentRef.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  useEffect(() => {
    if (!isFetching) return;
    callback().finally(() => setIsFetching(false));
  }, [isFetching, callback]);

  return { containerRef, isFetching };
};

// Hook for handling local storage
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};

// Hook for handling window size
export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

// Hook for handling click outside
export const useClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
};

// Hook for handling keyboard shortcuts
export const useKeyPress = (targetKey, handler) => {
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === targetKey) {
        handler(event);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [targetKey, handler]);
};

// Hook for handling previous value
export const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

// Hook for handling network status
export const useNetwork = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};

// Hook for handling authentication redirect
export const useAuthRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const from = location.state?.from?.pathname || `/${user.role}/dashboard`;
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  return user;
};