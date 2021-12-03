export function isInstalled() {
  if (typeof window !== "undefined") {
    // For iOS
    // @ts-ignore
    if (window.navigator.standalone) return true;

    // For Android
    if (window.matchMedia("(display-mode: standalone)").matches) return true;

    // If neither is true, it's not installed
    return false;
  }
}

export function getQueries() {
  if (typeof window !== "undefined") {
    const urlSearchParams = new URLSearchParams(window.location.search);
    return Object.fromEntries(urlSearchParams.entries());
  }
  return null;
}
