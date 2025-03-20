import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { toast } from 'react-hot-toast';

// Register service worker
serviceWorkerRegistration.register();

// Set up network status handlers
serviceWorkerRegistration.setupNetworkStatusHandlers();

// Handle network status changes
window.addEventListener('connectionStatusChanged', (event) => {
  const { isOnline } = event.detail;
  if (!isOnline) {
    toast.error('You are offline. Some features may be limited.', {
      duration: 3000,
      icon: '🌐'
    });
  } else {
    toast.success('You are back online!', {
      duration: 3000,
      icon: '✨'
    });
  }
});

// Request notification permission when the app starts
const requestNotificationPermission = async () => {
  const hasPermission = await serviceWorkerRegistration.requestNotificationPermission();
  if (hasPermission) {
    // Subscribe to push notifications
    const subscribed = await serviceWorkerRegistration.subscribeToPushNotifications();
    if (subscribed) {
      console.log('Successfully subscribed to push notifications');
    }
  }
};

// Check if the app is installed
const checkInstallStatus = () => {
  const isInstalled = serviceWorkerRegistration.isAppInstalled();
  if (!isInstalled) {
    // Show install button or prompt
    const installButton = document.getElementById('install-button');
    if (installButton) {
      installButton.style.display = 'block';
      installButton.addEventListener('click', async () => {
        const installed = await serviceWorkerRegistration.showInstallPrompt();
        if (installed) {
          installButton.style.display = 'none';
        }
      });
    }
  }
};

// Initialize app features
const initializeApp = () => {
  requestNotificationPermission();
  checkInstallStatus();
};

// Prevent React from hijacking error overlay in development
if (process.env.NODE_ENV === 'development') {
  window.addEventListener('error', (event) => {
    if (event.error?.stack?.includes('ResizeObserver loop')) {
      event.stopImmediatePropagation();
    }
  });
}

// Create root and render app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Initialize app after render
initializeApp();

// Handle PWA lifecycle events
window.addEventListener('load', () => {
  // Register background sync for offline functionality
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    serviceWorkerRegistration.registerBackgroundSync();
  }
});

// Handle PWA installation event
window.addEventListener('appinstalled', () => {
  toast.success('App installed successfully!', {
    duration: 3000,
    icon: '📱'
  });
});

// Handle beforeinstallprompt event
window.addEventListener('beforeinstallprompt', (event) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  event.preventDefault();
  // Store the event for later use
  window.deferredPrompt = event;
});

// Handle online/offline events with custom UI
let offlineToast = null;

window.addEventListener('online', () => {
  if (offlineToast) {
    toast.dismiss(offlineToast);
    offlineToast = null;
  }
  toast.success('Connection restored', {
    icon: '🌐',
    duration: 3000
  });
});

window.addEventListener('offline', () => {
  offlineToast = toast.error(
    'You are offline. The app will continue to work with limited functionality.',
    {
      icon: '📡',
      duration: Infinity
    }
  );
});

// Log errors to console in development
if (process.env.NODE_ENV === 'development') {
  window.onerror = (message, source, lineno, colno, error) => {
    console.error('Global error:', { message, source, lineno, colno, error });
  };

  window.onunhandledrejection = (event) => {
    console.error('Unhandled promise rejection:', event.reason);
  };
}