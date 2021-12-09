import { useEffect, useState } from "react";
import Router from "next/router";
import { ExclamationIcon, ThumbUpIcon } from "@heroicons/react/outline";
import { toast } from "react-toastify";
import { useTranslation } from "next-i18next";
import { BoInvitationValidResponse, BoEvent } from "../../src/types";
import Modal from "@components/Modal";

export interface IModal {
  link?: BoEvent["link"];
  userResponse?: BoInvitationValidResponse;
}
interface IModalContent {
  title: string;
  description: string;
}
interface IModalForm {
  username: string;
}

export default function InvitationModal({ link, userResponse }: IModal) {
  const { t } = useTranslation(["events", "common"]);
  let [isOpen, setIsOpen] = useState(false);
  const [formContent, setFormContent] = useState<IModalForm>();

  useEffect(() => {
    const username = localStorage.getItem("user_pseudo");
    if (username !== null) {
      setFormContent({ username });
    }
  }, []);

  useEffect(() => {
    if (link && userResponse) {
      setIsOpen(true);
    }
  }, [userResponse, link]);

  const postInvitationResponse = () => {
    if (!formContent?.username) {
      toast.error(t("errors.pseudo_missing", { ns: "common" }));
      return;
    }
    localStorage.setItem("user_pseudo", formContent.username);
    fetch("/api/events/invitations/response", {
      method: "POST",
      body: JSON.stringify({
        name: formContent.username,
        response: userResponse,
        link: link,
        user_id: localStorage.getItem("user_id") || undefined,
      }),
    }).then(async (res) => {
      if (res.status === 201) {
        const { user_id } = await res.json();
        if (
          localStorage.getItem("user_id") === null ||
          localStorage.getItem("user_id") === "undefined"
        ) {
          localStorage.setItem("user_id", user_id);
        }
        toast.info(t("response_success", { ns: "common" }));
        setIsOpen(false);
        Router.push(`/events/details/${link}`);
      } else {
        res
          .json()
          .then((data) => {
            toast.error(
              data.error ? data.error : t("errors.catch_all", { ns: "common" })
            );
          })
          .catch(() => {
            toast.error(t("errors.catch_all", { ns: "common" }));
          });
      }
    });
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
          <ThumbUpIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
        )
      }
      content={{
        title: t(`responses.${userResponse}.title`),
        description: t(`responses.${userResponse}.description`),
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
            {t("common.userName.label")}
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
            placeholder={t("common.userName.placeholder")}
          />
        </div>
      </form>
    </Modal>
  );
}
