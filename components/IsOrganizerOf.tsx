import { useState } from "react";
import { getUserID } from "src/utils/user";
import { toast } from "react-toastify";

export default function useIsOrganizerOfEvent(eventID: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [userChecked, setUserChecked] = useState(false);
  const [isOrganizer, setIsOrganizer] = useState(false);
  if (typeof window !== "undefined") {
    if (getUserID() !== null) {
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
  return { isOrganizer, isLoading, userChecked };
}
