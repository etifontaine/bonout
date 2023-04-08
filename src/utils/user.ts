export function getUserID() {
  return typeof localStorage !== "undefined" && localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))["id"]
    : null;
}

export function getUserName() {
  return typeof localStorage !== "undefined" && localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))["name"]
    : null;
}
