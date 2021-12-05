import type { NextPage } from "next";
import { useEffect, useState } from "react";
import Router from "next/router";
import Header from "@components/Header";
import { toast } from "react-toastify";
import { Form } from "@components/CreateEvent/Form/Form";
import type { Tform } from "@components/CreateEvent/Form/types";
import Loader from "@components/Loader";
import useIsOrganizerOfEvent from "hooks/useIsEventOrganiser";
import { BoEvent } from "src/types";
import { getEventByLink } from "src/models/events";
import { getUserID } from "src/utils/user";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

interface PageProps {
  event: BoEvent & { comingGuestAmount: number };
}

export async function getServerSideProps(context: {
  query: { link: string };
  locale: string;
}) {
  const { link } = context.query;
  const event = await getEventByLink(link);
  const cleanedEvent = {
    id: event?.id,
    address: event?.address,
    description: event?.description,
    start_at: event?.start_at,
    end_at: event?.end_at,
    link: event?.link,
    title: event?.title,
    user_name: event?.user_name || null,
  };

  return {
    props: {
      event: cleanedEvent,
      ...(await serverSideTranslations(context.locale, ["common", "events"])),
    },
  };
}

const EditEvent: NextPage<PageProps> = ({ event }) => {
  const { t } = useTranslation(["events", "common"]);
  const [isLoading, setIsLoading] = useState(false);
  const {
    isOrganizer,
    userChecked,
    isLoading: ILC,
  } = useIsOrganizerOfEvent(event.id);

  useEffect(() => {
    setIsLoading(ILC);
  }, [ILC]);

  return (
    <>
      <Header />

      <section className="pt-24 md:mt-0 h-screen flex justify-center md:flex-row md:justify-between lg:px-48 md:px-12 px-4 bg-secondary">
        <div className="md:max-w-3xl mx-auto w-full text-left">
          {(userChecked && isOrganizer) || isLoading ? (
            <>
              <h1 className="text-3xl md:text-5xl font-extrabold leading-tighter tracking-tighter mb-4 mt-5">
                {t("edit.title")}
              </h1>
              <div className="max-w-3xl mt-5 mx-auto relative">
                {isLoading && (
                  <div className="absolute top-0 left-0 right-0 bottom-0">
                    <Loader />
                  </div>
                )}

                <div
                  className={
                    isLoading ? "filter blur-sm pointer-events-none" : ""
                  }
                >
                  <Form event={event} onSubmit={handleSubmit} />
                </div>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-3xl md:text-5xl font-extrabold leading-tighter tracking-tighter mb-4 mt-5">
                {event.title}
              </h1>
              <h1 className="text-3xl md:text-5xl font-extrabold leading-tighter tracking-tighter mb-4 mt-5">
                {t("edit.unauthorized")}
              </h1>
              <Link
                href="/events/details/[link]"
                as={`/events/details/${event.link}`}
              >
                <a className="text-lg font-semibold text-center mt-5 underline">
                  {"<"} {t("edit.backToEvent")}
                </a>
              </Link>
            </>
          )}
        </div>
      </section>
    </>
  );

  function handleSubmit(
    e: React.FormEvent<HTMLFormElement>,
    { name, startAt, endAt, location, description, userName }: Tform,
    isValid: boolean
  ) {
    e.preventDefault();
    if (!isValid) {
      toast.error(t("errors.form_errors", { ns: "common" }));
      return;
    }
    setIsLoading(true);
    fetch("/api/events", {
      method: "PUT",
      body: JSON.stringify({
        id: event.id,
        title: name.value,
        start_at: new Date(startAt.value).toISOString(),
        end_at: new Date(endAt.value).toISOString(),
        address: location.value,
        description: description.value,
        user_id: getUserID(),
        user_name: userName.value,
      }),
    })
      .then(async (res) => {
        if (res.status === 201) {
          await res.json();
          toast.success("Evénement modifié");
          Router.push(`/events/details/${event.link}`);
        } else {
          res
            .json()
            .then((data) => {
              toast.error(
                data.error
                  ? data.error
                  : t("errors.catch_all", { ns: "common" })
              );
            })
            .catch(() => {
              toast.error(t("errors.catch_all", { ns: "common" }));
            });
        }
      })
      .finally(() => setIsLoading(false));
  }
};

export default EditEvent;
