"use client";

export function trackEvent(eventName: string, properties?: Record<string, any>) {
  if (typeof window === "undefined") return;
  const w = window as any;
  
  // Clarity
  if (typeof w.clarity === "function") {
    try {
      w.clarity("event", eventName, properties || {});
    } catch {}
  }
  
  // 发送到后端
  try {
    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: eventName,
        properties: properties || {},
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      }),
    }).catch(() => {});
  } catch {}
}

export function identifyUser(userId: string, traits?: Record<string, any>) {
  if (typeof window === "undefined") return;
  const w = window as any;
  
  if (typeof w.clarity === "function") {
    try {
      w.clarity("identify", userId);
      if (traits) {
        Object.entries(traits).forEach(([key, value]) => {
          w.clarity("set", key, value);
        });
      }
    } catch {}
  }
}
