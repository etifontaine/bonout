import { createContext, useEffect, useState } from "react";
import cookieCutter from "cookie-cutter";

//Defining context
export const ManagedUI = createContext(undefined);

//Context Wrapper
export function ManagedUIProvider({ children }) {
  const [openModal, setOpenModal] = useState(false);
  const [user, setUser] = useState();

  useEffect(() => {
    if (user) {
      cookieCutter.set(
        "bonout-user",
        JSON.stringify({
          id: user["id"],
          name: user["name"],
        })
      );
    }
  }, [user]);

  return (
    <ManagedUI.Provider
      value={{
        openModal,
        setOpenModal,
        user,
        setUser,
      }}
    >
      {children}
    </ManagedUI.Provider>
  );
}
