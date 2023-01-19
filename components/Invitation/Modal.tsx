import { useEffect, useState } from "react";
import Router, { useRouter } from "next/router";
import { ExclamationIcon, ThumbUpIcon } from "@heroicons/react/outline";
import { toast } from "react-toastify";
import { BoInvitationValidResponse, BoEvent } from "../../src/types";
import Modal from "@components/Modal";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@src/firebase/client";

export interface IModal {
  event: BoEvent;
  userResponse?: BoInvitationValidResponse;
}
interface IModalContent {
  title: string;
  description: string;
}
interface IModalForm {
  username: string;
}

export default function InvitationModal({ event, userResponse }: IModal) {
  const router = useRouter()
  let [isOpen, setIsOpen] = useState(false);
  let [isLoading, setIsLoading] = useState(false);
  const [formContent, setFormContent] = useState<IModalForm>();

  useEffect(() => {
    const username = localStorage.getItem("user_pseudo");
    if (username !== null) {
      setFormContent({ username });
    }
  }, []);

  useEffect(() => {
    if (event?.link && userResponse) {
      setIsOpen(true);
    }
  }, [userResponse, event]);

  const postInvitationResponse = () => {
    if (!formContent?.username) {
      toast.error("Vous devez renseigner un pseudo");
      return;
    }
    
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    const user_id = localStorage.getItem("user_id") || undefined
    localStorage.setItem("user_pseudo", formContent.username);

    const hasInvitation = event.invitations.findIndex(i => i.user_id === user_id)
    
    if (hasInvitation >= 0) {
      event.invitations[hasInvitation].response = userResponse as string;
    } else {
      event.invitations.push({
        name: formContent.username,
        link: event.link,
        eventID: event.id,
        user_id: user_id,
        response: userResponse as string
      })
    }
    updateDoc(doc(db, `${process.env.NEXT_PUBLIC_DB_ENV}_events`, event.id), {
      invitations: event.invitations
    })

    setIsLoading(false);
    setIsOpen(false);
    router.push({
      pathname: `/events/details/${event.link}`,
      search: '?refresh=true',
    })
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      onConfirm={postInvitationResponse}
      icon={
        userResponse === BoInvitationValidResponse.NO ? (
          <ExclamationIcon
            className="h-6 w-6 text-red-600"
            aria-hidden="true"
          />
        ) : (
          <ThumbUpIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
        )
      }
      content={{
        title: `Votre réponse`,
<<<<<<< HEAD
        description:
          userResponse === BoInvitationValidResponse.YES
            ? "Veuillez confirmer votre venue en indiquant votre nom"
            : userResponse === BoInvitationValidResponse.NO
            ? "Veuillez confirmer que vous ne viendrez pas à cet événement"
            : "Veuillez confirmer indiquer votre nom ou pseudo pour confirmer votre choix",
=======
        description: userResponse === BoInvitationValidResponse.YES ? "Veuillez confirmer votre venue en indiquant votre nom" : userResponse === BoInvitationValidResponse.NO ? "Veuillez confirmer que vous ne viendrez pas à cet événement" : "Veuillez confirmer indiquer votre nom ou pseudo pour confirmer votre choix",
>>>>>>> 08f9ccd (feat(firebase): Use client side)
      }}
    >
      <form
        className="bg-white pt-6 pb-8"
        onSubmit={(e) => {
          e.preventDefault();
          postInvitationResponse();
        }}
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="username"
          >
            Nom
          </label>
          <input
            autoComplete="on"
            value={formContent?.username}
            onChange={(e) => {
              setFormContent({ username: e.target.value });
            }}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="username"
            name="username"
            type="text"
            placeholder="Nom ou pseudo"
          />
        </div>
      </form>
    </Modal>
  );
}
