// serviceWorkerRegistration.js
export function register() {
    if ("serviceWorker" in navigator) {
      // Verificăm dacă suntem în producție
      if (process.env.NODE_ENV === "production") {
        window.addEventListener("load", () => {
          const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
  
          navigator.serviceWorker
            .register(swUrl)
            .then((registration) => {
              console.log("Service Worker registered: ", registration);
            })
            .catch((error) => {
              console.error("Service Worker registration failed:", error);
            });
        });
      }
    }
  }
  
  export function unregister() {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.unregister();
      });
    }
  }
  