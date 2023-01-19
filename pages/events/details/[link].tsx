import React, { useEffect, useState } from "react";
import type { NextPage } from "next";
import Link from "next/link";
import Router from "next/router";
import Head from "next/head";
import Skeleton from "react-loading-skeleton";
import Header from "@components/Header";
import ModalInvitation from "@components/Invitation/Modal";
import type { IModal } from "@components/Invitation/Modal";
import useIsOrganizerOfEvent from "hooks/useIsEventOrganiser";
import GuestListModal from "@components/GuestListModal";
import { BoEvent, BoInvitationValidResponse } from "src/types";
import { getEventByLink } from "src/models/events";
import { getUserID } from "src/utils/user";
import AddCalendarModal from "@components/AddCalendarModal";
import Modal from "@components/Modal";
import Loader from "@components/Loader";
import { useRouter } from "next/router";

const DeleteModal = Modal;
import {
  CalendarIcon,
  LinkIcon,
  LocationMarkerIcon,
  PencilIcon,
  UserGroupIcon,
  UserIcon,
  TrashIcon,
} from "@heroicons/react/outline";
import logger from "@src/logger";
import { toast } from "react-toastify";
import { isClientSide } from "@src/utils/client";
import fetcher from "@src/utils/fetcher";

interface PageProps {
  event: BoEvent & { comingGuestAmount: number };
}

export async function getServerSideProps(context: {
  query: { link: string };
  locale: string;
}) {
  const { link } = context.query;
  const event = await getEventByLink(link);

  if (!event) {
    return {
      redirect: {
        permanent: false,
        destination: "/home",
      },
      props: {},
    };
  }

  const cleanedEvent = {
    id: event?.id || null,
    address: event?.address,
    description: event?.description,
    start_at: event?.start_at,
    end_at: event?.end_at,
    link: event?.link,
    title: event?.title,
    invitations: event?.invitations || [],
    user_name: event?.user_name || null,
    comingGuestAmount: event?.comingGuestAmount,
    notComingGuestAmount: event?.notComingGuestAmount,
    maybeComingGuestAmount: event?.maybeComingGuestAmount,
  };

  return {
    props: {
      event: cleanedEvent,
    },
  };
}

const EventDetails: NextPage<PageProps> = ({ event }) => {
  if (!event) {
    Router.push("/home");
  }
  const { isOrganizer, userChecked } = useIsOrganizerOfEvent(event.id);

  const [userInvitationResponse, setUserInvitationResponse] =
    useState<string>();
  const [userInvitationResponseValue, setUserInvitationResponseValue] =
    useState<string>();

  const [modalContent, setModal] = useState<IModal | null>(null);
  const [isGuestListVisible, setGuestListVisible] = useState(false);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isAddCalendarVisible, setAddCalendarVisible] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const { query } = useRouter();

  useEffect(() => {
    if (query.openGuestList && query.openGuestList === "true") {
      setGuestListVisible(true);
    }
  }, [query]);

  useEffect(() => {
    if (getUserID() && !isOrganizer && userChecked) {
      fetcher(
        `/api/users/${getUserID()}/checkIfUserComing/${event.id}`,
        "GET"
      ).then((res) => {
        if (res.status === 200) {
          res.json().then((data) => {
            if (data.response && data.response !== "undefined") {
              setUserInvitationResponseValue(data.response);
              // setUserInvitationResponse(
              //   t("common.userResponse", {
              //     response: t(`common.response.${data.response}`),
              //   })
              // );
            }
          });
        }
      });
    }
  }, [userChecked, isOrganizer, event]);

  const setResponse = (userResponse: BoInvitationValidResponse) => {
    setModal({ userResponse, link: event.link });
  };

  const shareEvent = () => {
    if (navigator.share) {
      navigator
        .share({
          title: event.title,
          text: event.description,
          url: event.link,
        })
        .catch((error) => logger.error({ message: "Error sharing", error }));
    }
  };

  const openAddress = () => {
    let address = event.address.replace(/\s\s+/g, " "); // remove spaces
    address = encodeURIComponent(address);

    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (isSafari) {
      window.open("http://maps.apple.com/?q=" + address);
    } else {
      /* else use Google */
      window.open("https://maps.google.com/maps?q=" + address);
    }
  };

  const handleDeleteEvent = () => {
    setDeleteModalVisible(false);
    setLoading(true);

    fetcher(
      `/api/events/`,
      "DELETE",
      JSON.stringify({ id: event.id, user_id: getUserID() })
    ).then((res) => {
      if (res.status === 200) {
        Router.push("/home");
      } else {
        setLoading(false);
        logger.error({ message: "Error deleting event", res });
        toast.error("Une erreur est survenue lors de la suppression de l'événement");
      }
    });
  };

  return (
    <>
      <Head>
        <title>Bonout - {event.title}</title>
        <meta property="og:title" content={`Bonout - ${event.title}`} />
        <meta property="og:description" content={`${event.description}`} />
      </Head>
      <ModalInvitation
        link={modalContent?.link}
        userResponse={modalContent?.userResponse}
      />
      <DeleteModal
        isOpen={isDeleteModalVisible}
        content={{
          title: "Supprimer l'événement",
          description: "Êtes-vous sûr de vouloir supprimer cet événement ?",
        }}
        onClose={() => setDeleteModalVisible(false)}
        onConfirm={handleDeleteEvent}
        icon={<TrashIcon className="h-20 w-20" aria-hidden="true" />}
      >
        {" "}
      </DeleteModal>
      <AddCalendarModal
        isOpen={isAddCalendarVisible}
        event={event}
        onClose={() => {
          setAddCalendarVisible(false);
        }}
      />
      <GuestListModal
        isVisible={isGuestListVisible}
        setGuestListVisible={setGuestListVisible}
        guests={event.invitations}
      />
      {/*  Site header */}
      <Header />
      <section className="pt-24 md:mt-0 h-screen flex justify-center md:flex-row md:justify-between lg:px-48 md:px-12 px-4 bg-secondary">
        {isLoading && (
          <div className="absolute top-0 left-0 right-0 bottom-0">
            <Loader />
          </div>
        )}

        <div
          className={
            "md:max-w-3xl mx-auto w-full text-left" +
            " " +
            (isLoading ? "filter blur-sm pointer-events-none" : null)
          }
        >
          <div className="py-5 sm:px-4 grid grid-cols-5">
            <div className="col-span-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {event.title}
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                {event.description}
              </p>
            </div>
            {isOrganizer ? (
              <div className="flex justify-end items-center">
                <TrashIcon
                  onClick={(e) => setDeleteModalVisible(true)}
                  className="block h-4 w-4 cursor-pointer"
                  aria-hidden="true"
                />

                <Link
                  href="/events/edit/[link]"
                  as={`/events/edit/${event.link}`}
                >
                  <a>
                    <PencilIcon
                      className="block ml-4 h-4 w-4"
                      aria-hidden="true"
                    />
                  </a>
                </Link>
              </div>
            ) : null}
          </div>
          <div className="border-t border-gray-200">
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <div className="text-sm font-medium text-gray-500">
                Date
              </div>
              <div className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center">
                <CalendarIcon
                  className="block h-3 w-3 mr-2"
                  aria-hidden="true"
                />
                <button
                  className="underline"
                  onClick={() => setAddCalendarVisible(true)}
                >
                  {" "}
                  {/* {t("date.intlDateTimeFromTo", {
                    start_at: event.start_at,
                    end_at: event.end_at,
                    formatParams: {
                      start_at: { dateStyle: "medium", timeStyle: "short" },
                      end_at: { dateStyle: "medium", timeStyle: "short" },
                    },
                  })} */}
                </button>
              </div>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <div className="text-sm font-medium text-gray-500">
                Adresse
              </div>
              <div className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center">
                <LocationMarkerIcon
                  className="block h-3 w-3 mr-2"
                  aria-hidden="true"
                />
                <button className="underline" onClick={() => openAddress()}>
                  {event.address}
                </button>
              </div>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <div className="text-sm font-medium text-gray-500">
                Lien
              </div>
              <div className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center">
                <LinkIcon className="block h-3 w-3 mr-2" aria-hidden="true" />
                <button className="underline" onClick={() => shareEvent()}>{`${isClientSide()
                  ? `${window.location.host}/events/details/`
                  : null
                  }${event.link}`}</button>
              </div>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <div className="text-sm font-medium text-gray-500">
                Organisateur
              </div>
              <div className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center">
                <UserIcon className="block h-3 w-3 mr-2" aria-hidden="true" />
                {userChecked ? (
                  isOrganizer ? (
                    "C'est votre événement"
                  ) : (
                    event.user_name || "Anonyme"
                  )
                ) : (
                  <Skeleton width="50" />
                )}
              </div>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <div className="text-sm flex justify-between font-medium text-gray-500">
                <span>Invités</span>
                {event.invitations.length > 0 ? (
                  <button
                    className="text-yellow-500 text-sm underline"
                    onClick={() => setGuestListVisible(true)}
                  >
                    "Voir la liste"
                  </button>
                ) : null}
              </div>
              <div className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-1  flex items-center">
                <UserGroupIcon
                  className="block h-3 w-3 mr-2"
                  aria-hidden="true"
                />
                <p>
                  Accepter: {event.comingGuestAmount}
                  <br />
                  Refuser: {event.notComingGuestAmount}
                  <br />
                  Peut-être: {event.maybeComingGuestAmount}
                </p>
              </div>
            </div>
            {!isOrganizer && userChecked && (
              <div className="py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 flex justify-between">
                <button
                  onClick={() => setResponse(BoInvitationValidResponse.NO)}
                  className={`btn border border-black ${userInvitationResponseValue === BoInvitationValidResponse.NO
                    ? "bg-black text-white"
                    : "text-black"
                    } p-2 btn-sm hover:text-white hover:bg-black`}
                >
                  Refuser
                </button>
                <button
                  onClick={() => setResponse(BoInvitationValidResponse.YES)}
                  className={`btn border border-black ${userInvitationResponseValue ===
                    BoInvitationValidResponse.YES
                    ? "bg-black text-white"
                    : "text-black"
                    } p-2 btn-sm ml-3 hover:text-white hover:bg-black`}
                >
                  Accepter
                </button>
                <button
                  onClick={() => setResponse(BoInvitationValidResponse.MAYBE)}
                  className={`btn border border-black ${userInvitationResponseValue ===
                    BoInvitationValidResponse.MAYBE
                    ? "bg-black text-white"
                    : "text-black"
                    }  p-2 btn-sm ml-3 hover:text-white hover:bg-black`}
                >
                  Peut-être
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default EventDetails;
