// Check if service workers are supported
const isServiceWorkerSupported = 'serviceWorker' in navigator;

// Register the service worker
export const register = () => {
  if (isServiceWorkerSupported && process.env.NODE_ENV === 'production') {
    window.addEventListener('load', () => {
      const swUrl = '/sw.js';

      registerValidSW(swUrl);

      // Add beforeinstallprompt event handler for PWA install prompt
      window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        e.preventDefault();
        // Stash the event so it can be triggered later
        window.deferredPrompt = e;
      });

      // Handle PWA installed
      window.addEventListener('appinstalled', () => {
        // Clear the deferredPrompt
        window.deferredPrompt = null;
        // Log or track the installation
        console.log('PWA was installed');
      });
    });
  }
};

function registerValidSW(swUrl) {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      // Check for updates on page load
      registration.update();

      // Set up periodic updates
      setInterval(() => {
        registration.update();
      }, 1000 * 60 * 60); // Check for updates every hour

      registration.addEventListener('updatefound', () => {
        const installingWorker = registration.installing;
        if (installingWorker == null) {
          return;
        }

        installingWorker.addEventListener('statechange', () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // New content is available; please refresh
              console.log('New content is available; please refresh');
              
              // Show refresh prompt to user
              if (window.confirm('New version available! Click OK to refresh.')) {
                window.location.reload();
              }
            } else {
              // Content is cached for offline use
              console.log('Content is cached for offline use');
            }
          }
        });
      });
    })
    .catch((error) => {
      console.error('Error during service worker registration:', error);
    });
}

// Unregister service worker
export const unregister = () => {
  if (isServiceWorkerSupported) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
};

// Request notification permission
export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
};

// Subscribe to push notifications
export const subscribeToPushNotifications = async () => {
  try {
    const registration = await navigator.serviceWorker.ready;
    
    // Get the push subscription
    let subscription = await registration.pushManager.getSubscription();

    // If no subscription, create one
    if (!subscription) {
      const response = await fetch('/api/push/vapid-public-key');
      const vapidPublicKey = await response.text();
      
      const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey
      });
    }

    // Send the subscription to the server
    await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscription)
    });

    return true;
  } catch (error) {
    console.error('Error subscribing to push notifications:', error);
    return false;
  }
};

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Handle offline/online status
export const setupNetworkStatusHandlers = () => {
  const updateOnlineStatus = () => {
    const condition = navigator.onLine ? 'online' : 'offline';
    console.log(`Connection status: ${condition}`);
    
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('connectionStatusChanged', {
      detail: { isOnline: navigator.onLine }
    }));
  };

  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);

  // Initial check
  updateOnlineStatus();
};

// Background sync for offline data
export const registerBackgroundSync = async () => {
  try {
    const registration = await navigator.serviceWorker.ready;
    await registration.sync.register('sync-attendance');
    return true;
  } catch (error) {
    console.error('Error registering background sync:', error);
    return false;
  }
};

// Check if app is installed
export const isAppInstalled = () => {
  return window.matchMedia('(display-mode: standalone)').matches ||
         window.navigator.standalone === true;
};

// Show install prompt
export const showInstallPrompt = async () => {
  if (window.deferredPrompt) {
    try {
      // Show the prompt
      const { outcome } = await window.deferredPrompt.prompt();
      console.log(`Install prompt outcome: ${outcome}`);
      
      // Clear the deferredPrompt
      window.deferredPrompt = null;
      
      return outcome === 'accepted';
    } catch (error) {
      console.error('Error showing install prompt:', error);
      return false;
    }
  }
  return false;
};