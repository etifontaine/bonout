import { useEffect, useState } from "react";
import { getUserID } from "src/utils/user";
import { toast } from "react-toastify";

export default function useIsOrganizerOfEvent(eventID: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [userChecked, setUserChecked] = useState(false);
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [once, setOnce] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined" && !once) {
      setOnce(true);
      if (getUserID() !== null && !userChecked) {
        if (isLoading === false && !userChecked) setIsLoading(true);
        fetch(`/api/users/${getUserID()}/isOrganizerOf/${eventID}`)
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
      }
    }
  }, [isLoading, userChecked, eventID, once]);

  return { isOrganizer, isLoading, userChecked };
}
