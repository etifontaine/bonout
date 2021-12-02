import { isInstalled } from ".";

export function getUserID() {
  const queries = getQueries();
  console.log(queries);
  return typeof localStorage !== "undefined"
    ? localStorage.getItem("user_id")
    : isInstalled() && queries
    ? queries.userID || null
    : null;
}

export function getUserName() {
  const queries = getQueries();
  return typeof localStorage !== "undefined"
    ? localStorage.getItem("user_name")
    : isInstalled() && queries
    ? queries.userName || null
    : null;
}

function getQueries() {
  if (typeof window !== "undefined") {
    const urlSearchParams = new URLSearchParams(window.location.search);
    return Object.fromEntries(urlSearchParams.entries());
  }
  return null;
}
