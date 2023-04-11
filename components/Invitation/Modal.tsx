import { useContext, useEffect, useState } from "react";
import Router from "next/router";
import { ExclamationIcon, ThumbUpIcon } from "@heroicons/react/outline";
import { toast } from "react-toastify";
import { BoInvitationValidResponse, BoEvent } from "../../src/types";
import Modal from "@components/Modal";
import { ManagedUI } from "@src/context/UIContext";
import Loader from "@components/Loader";

export interface IModal {
  event: BoEvent;
  userResponse?: BoInvitationValidResponse;
}
interface IModalForm {
  username: string;
  password: string;
}

export default function InvitationModal({
  event,
  userResponse,
  isInvitationOpen,
  setInvitationOpen,
}: any) {
  let [isLoading, setIsLoading] = useState(false);
  const { setOpenModal, user, setUser } = useContext(ManagedUI);
  const [formContent, setFormContent] = useState<IModalForm>({
    username: null,
    password: null,
  });

  useEffect(() => {
    if (user) {
      setFormContent({ username: user.name, password: user.id });
    }
  }, [user]);

  const postInvitationResponse = async () => {
    if (!formContent?.username) {
      toast.error("Vous devez renseigner un pseudo");
      return;
    }

    if (isLoading) {
      return;
    }
    setIsLoading(true);
    let response = await fetch(`/api/guests/${event.link}`, {
      method: "POST",
      body: JSON.stringify({
        response: userResponse,
        name: formContent.username,
        id: formContent.password,
      }),
    });
    const addGuest = await response.json();
    if (addGuest["error"] === "User already exists") {
      toast.error("Ce nom et ce mot de passe sont déjà utilisés");
    }
    if (response.status < 400) {
      setInvitationOpen(false);
      Router.push(`/home`);
    } else {
      setInvitationOpen(true);
    }

    setIsLoading(false);
  };
  return (
    <Modal
      isOpen={isInvitationOpen}
      onClose={() => setInvitationOpen(false)}
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
        description:
          userResponse === BoInvitationValidResponse.YES
            ? "Veuillez confirmer votre venue en indiquant votre nom"
            : userResponse === BoInvitationValidResponse.NO
            ? "Veuillez confirmer que vous ne viendrez pas à cet événement"
            : "Veuillez confirmer indiquer votre nom ou pseudo pour confirmer votre choix",
      }}
    >
      {isLoading && (
        <div className="absolute top-0 left-0 right-0 bottom-0">
          <Loader />
        </div>
      )}
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
              setFormContent({
                username: e.target.value,
                password: formContent?.password,
              });
            }}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="username"
            name="username"
            type="text"
            placeholder="Nom"
          />
        </div>
      </form>
    </Modal>
  );
}
