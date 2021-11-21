export function getUserID() {
  return typeof localStorage !== "undefined"
    ? localStorage.getItem("user_id")
    : null;
}
