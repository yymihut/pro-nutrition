// serviceWorkerRegistration.js
export function register() {
  if ("serviceWorker" in navigator) {
    // Verificăm dacă suntem în producție
    if (process.env.NODE_ENV === "production") {
      window.addEventListener("load", async () => {
        const swUrl = "/service-worker.js"; // ✅ Calea fixă pentru Vercel

        try {
          // ✅ Verificăm dacă fișierul există înainte de înregistrare
          const response = await fetch(swUrl, { method: "HEAD" });

          if (!response.ok) {
            console.warn("❌ Service Worker not found. Skipping registration.");
            return;
          }

          // ✅ Înregistrăm Service Worker-ul
          const registration = await navigator.serviceWorker.register(swUrl);
          console.log("✅ Service Worker registered:", registration);
        } catch (error) {
          console.error("❌ Service Worker registration failed:", error);
        }
      });
    }
  }
}

export function unregister() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => console.error("❌ Service Worker unregistration failed:", error));
  }
}
