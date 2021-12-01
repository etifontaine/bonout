export function getUserID() {
  return typeof localStorage !== "undefined"
    ? localStorage.getItem("user_id")
    : null;
}

export function getUserName() {
  return typeof localStorage !== "undefined"
    ? localStorage.getItem("user_name")
    : null;
}
