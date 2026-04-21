
export function getOrCreateSessionId() {
  if (typeof window === "undefined") return null;

  const existing = localStorage.getItem("visitor_session_id");
  if (existing) return existing;

  const newId = crypto.randomUUID();
  localStorage.setItem("visitor_session_id", newId);
  return newId;
}