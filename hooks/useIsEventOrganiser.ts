import { useEffect, useState } from "react";
import { getUserID } from "src/utils/user";
import { toast } from "react-toastify";
import { isClientSide } from "@src/utils/client";
import fetcher from "@src/utils/fetcher";

export default function useIsEventOrganiser(eventID: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [userChecked, setUserChecked] = useState(false);
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [once, setOnce] = useState(false);
  useEffect(() => {
    if (isClientSide() && !once) {
      setOnce(true);
      if (getUserID() !== null && !userChecked) {
        if (isLoading === false && !userChecked) setIsLoading(true);
        fetcher(`/api/users/${getUserID()}/isOrganizerOf/${eventID}`, "GET")
          .then((res) => {
            if (res.status === 200) {
              res.json().then((data) => {
                if (data.error) {
                  toast.error(data.error);
                } else {
                  setIsOrganizer(data);
                  setUserChecked(true);
                }
              });
            }
          })
          .finally(() => setIsLoading(false));
      } else {
        setUserChecked(true);
      }
    }
  }, [isLoading, userChecked, eventID, once]);

  return { isOrganizer, isLoading, userChecked };
}
