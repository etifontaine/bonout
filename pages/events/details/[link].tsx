import React, { useContext, useEffect, useState } from "react";
import type { NextPage } from "next";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import Head from "next/head";
import Header from "@components/Header";
import ModalInvitation from "@components/Invitation/Modal";
import type { IModal } from "@components/Invitation/Modal";
import GuestListModal from "@components/GuestListModal";
import { BoEvent, BoInvitationValidResponse } from "src/types";
import AddCalendarModal from "@components/AddCalendarModal";
import Modal from "@components/Modal";
import { parse } from "cookie";

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
import { fetcher } from "@src/utils/fetcher";
import { format, parseISO } from "date-fns";
import { ManagedUI } from "@src/context/UIContext";
import { getEventByLink } from "@src/events";

export async function getServerSideProps(context) {
  const event = await getEventByLink(context.params.link);
  const cookies = context.req.headers.cookie;
  let isOrganizer = false;
  if (cookies) {
    const parsedCookie = parse(cookies);
    const userPayload = parsedCookie["bonout-user"];
    if (userPayload) {
      const user = JSON.parse(userPayload);
      isOrganizer = user.name === event.user.name;
    }
  }
  return {
    props: {
      event,
      isOrganizer,
    },
  };
}

const EventDetails: NextPage = (props: any) => {
  const [userInvitationResponseValue, setUserInvitationResponseValue] =
    useState<string>();
  const [modalContent, setModal] = useState<IModal | null>(null);
  const [isGuestListVisible, setGuestListVisible] = useState(false);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isAddCalendarVisible, setAddCalendarVisible] = useState(false);
  const [isInvitationOpen, setInvitationOpen] = useState(false);

  const data = props.event;
  const isOrganizer = props.isOrganizer;

  const router = useRouter();
  const refreshData = () => {
    router.replace(router.asPath);
  };
  useEffect(() => {
    if (!isInvitationOpen) refreshData();
  }, [isInvitationOpen]);

  const setResponse = (
    userResponse: BoInvitationValidResponse,
    event: BoEvent
  ) => {
    setModal({ userResponse, event });
    setInvitationOpen(true);
  };

  const shareEvent = (event: BoEvent) => {
    if (navigator.share) {
      navigator
        .share({
          title: event.title,
          text: event.description,
          url: `/events/details/${event.link}`,
        })
        .catch((error) => logger.error({ message: "Error sharing", error }));
    }
  };

  const openAddress = (event: BoEvent) => {
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

  const handleDeleteEvent = async (event: BoEvent) => {
    await fetcher(`/api/events/${event.link}`, { method: "DELETE" })
      .then(() => {
        setDeleteModalVisible(false);
        Router.push("/home");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  if (!data) {
    return null;
  }
  return (
    <>
      <Head>
        <title>Bonout - {data.title}</title>
        <meta property="og:title" content={`Bonout - ${data.title}`} />
        <meta property="og:description" content={`${data.description}`} />
      </Head>
      <ModalInvitation
        event={data}
        userResponse={modalContent?.userResponse}
        isInvitationOpen={isInvitationOpen}
        setInvitationOpen={setInvitationOpen}
      />
      <DeleteModal
        isOpen={isDeleteModalVisible}
        content={{
          title: "Supprimer l'événement",
          description: "Êtes-vous sûr de vouloir supprimer cet événement ?",
        }}
        onClose={() => setDeleteModalVisible(false)}
        onConfirm={() => handleDeleteEvent(data)}
        icon={<TrashIcon className="h-20 w-20" aria-hidden="true" />}
      >
        {" "}
      </DeleteModal>
      <AddCalendarModal
        isOpen={isAddCalendarVisible}
        event={data}
        onClose={() => {
          setAddCalendarVisible(false);
        }}
      />
      <GuestListModal
        isVisible={isGuestListVisible}
        setGuestListVisible={setGuestListVisible}
        guests={data.guests}
      />
      {/*  Site header */}
      <Header />
      <section className="pt-24 md:mt-0 h-screen flex justify-center md:flex-row md:justify-between lg:px-48 md:px-12 px-4 bg-secondary">
        <div className={"md:max-w-3xl mx-auto w-full text-left"}>
          <div className="py-5 sm:px-4 grid grid-cols-5">
            <div className="col-span-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {data.title}
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                {data.description}
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
                  as={`/events/edit/${data.link}`}
                >
                  <PencilIcon
                    className="block ml-4 h-4 w-4"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            ) : null}
          </div>
          <div className="border-t border-gray-200">
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <div className="text-sm font-medium text-gray-500">Date</div>
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
                  {`Du ${format(
                    parseISO(data.start_at),
                    "dd/MM/yyyy HH:mm"
                  )} au ${format(parseISO(data.end_at), "dd/MM/yyyy HH:mm")}`}
                </button>
              </div>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <div className="text-sm font-medium text-gray-500">Adresse</div>
              <div className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center">
                <LocationMarkerIcon
                  className="block h-3 w-3 mr-2"
                  aria-hidden="true"
                />
                <button className="underline" onClick={() => openAddress(data)}>
                  {data.address}
                </button>
              </div>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <div className="text-sm font-medium text-gray-500">Lien</div>
              <div className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center">
                <LinkIcon className="block h-3 w-3 mr-2" aria-hidden="true" />
                <button className="underline" onClick={() => shareEvent(data)}>
                  Partager
                </button>
              </div>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <div className="text-sm font-medium text-gray-500">
                Organisateur
              </div>
              <div className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center">
                <UserIcon className="block h-3 w-3 mr-2" aria-hidden="true" />
                {isOrganizer
                  ? "C'est votre événement"
                  : data.user.name || "Anonyme"}
              </div>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <div className="text-sm flex justify-between font-medium text-gray-500">
                <span>Invités</span>
                {data.guests.all.length > 0 ? (
                  <button
                    className="text-yellow-500 text-sm underline"
                    onClick={() => setGuestListVisible(true)}
                  >
                    Voir la liste
                  </button>
                ) : null}
              </div>
              <div className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-1  flex items-center">
                <UserGroupIcon
                  className="block h-3 w-3 mr-2"
                  aria-hidden="true"
                />
                <p>
                  Accepté: {data.guests.coming.length}
                  <br />
                  Refusé: {data.guests.not_coming.length}
                  <br />
                  Peut-être: {data.guests.maybe.length}
                </p>
              </div>
            </div>
            {!isOrganizer && (
              <div className="py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 flex justify-between">
                <button
                  onClick={() =>
                    setResponse(BoInvitationValidResponse.NO, data)
                  }
                  className={`btn border border-black ${
                    userInvitationResponseValue === BoInvitationValidResponse.NO
                      ? "bg-black text-white"
                      : "text-black"
                  } p-2 btn-sm hover:text-white hover:bg-black`}
                >
                  Refusé
                </button>
                <button
                  onClick={() =>
                    setResponse(BoInvitationValidResponse.YES, data)
                  }
                  className={`btn border border-black ${
                    userInvitationResponseValue ===
                    BoInvitationValidResponse.YES
                      ? "bg-black text-white"
                      : "text-black"
                  } p-2 btn-sm ml-3 hover:text-white hover:bg-black`}
                >
                  Accepté
                </button>
                <button
                  onClick={() =>
                    setResponse(BoInvitationValidResponse.MAYBE, data)
                  }
                  className={`btn border border-black ${
                    userInvitationResponseValue ===
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
