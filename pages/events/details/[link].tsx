import React, { useEffect, useState } from "react";
import type { NextPage } from "next";
import Link from "next/link";
import Router from "next/router";
import Head from "next/head";
import dayjs from "dayjs";
import Skeleton from "react-loading-skeleton";
import Header from "@components/Header";
import Modal from "@components/Invitation/Modal";
import useIsOrganizerOfEvent from "hooks/useIsEventOrganiser";
import GuestListModal from "@components/GuestListModal";
import { BoEvent, BoInvitationValidResponse } from "src/types";
import { getEventByLink } from "src/models/events";
import { getUserID, getUserName } from "src/utils/user";
import AddCalendarModal from "@components/AddCalendarModal";
import {
  CalendarIcon,
  LinkIcon,
  LocationMarkerIcon,
  PencilIcon,
  UserGroupIcon,
  UserIcon,
} from "@heroicons/react/outline";
import { responses } from "content/responses";
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

interface PageProps {
  event: BoEvent & { comingGuestAmount: number };
}

export interface IModal {
  link?: BoEvent["link"];
  userResponse?: BoInvitationValidResponse;
}

export async function getServerSideProps(context: { query: { link: string; }; locale: string; }) {
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
    invitations: event?.invitations || [],
    user_name: event?.user_name || null,
    comingGuestAmount: event?.comingGuestAmount,
    notComingGuestAmount: event?.notComingGuestAmount,
    maybeComingGuestAmount: event?.maybeComingGuestAmount,
  };

  return {
    props: {
      event: cleanedEvent,
      ...await serverSideTranslations(context.locale, ['common', 'events']),
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

  useEffect(() => {
    if (getUserID() && !isOrganizer && userChecked) {
      fetch(`/api/users/${getUserID()}/checkIfUserComing/${event.id}`).then(
        (res) => {
          if (res.status === 200) {
            res.json().then((data) => {
              if (data.response !== "undefined") {
                setUserInvitationResponse(`Tu as répondu ${data.response}`);
              }
            });
          }
        }
      );
    }
  }, [userChecked, isOrganizer, event.id]);

  const [modalContent, setModal] = useState<IModal>({});
  const [isGuestListVisible, setGuestListVisible] = useState(false);
  const [isAddCalendarVisible, setAddCalendarVisible] = useState(false);

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
        .catch((error) => console.log("Error sharing", error));
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

  return (
    <>
      <Head>
        <title>Bonout - {event.title}</title>
        <meta property="og:title" content={`Bonout - ${event.title}`} />
        <meta property="og:description" content={`${event.description}`} />
        <meta
          property="og:image"
          content={`${process.env.NEXT_PUBLIC_BASE_URL}/header-30112021.png`}
        />
        <link
          rel="apple-touch-icon"
          sizes="57x57"
          href="/logos/apple-icon-57x57.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="60x60"
          href="/logos/apple-icon-60x60.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="72x72"
          href="/logos/apple-icon-72x72.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="76x76"
          href="/logos/apple-icon-76x76.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="114x114"
          href="/logos/apple-icon-114x114.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="120x120"
          href="/logos/apple-icon-120x120.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="144x144"
          href="/logos/apple-icon-144x144.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/logos/apple-icon-152x152.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/logos/apple-icon-180x180.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/logos/android-icon-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/logos/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="96x96"
          href="/logos/favicon-96x96.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/logos/favicon-16x16.png"
        />
        <link rel="manifest" href="/manifest.json" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#F3F2ED" />
      </Head>
      <Modal
        link={modalContent.link}
        userResponse={modalContent.userResponse}
      />

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
        <div className="md:max-w-3xl mx-auto w-full text-left">
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
                <Link
                  href="/events/edit/[link]"
                  as={`/events/edit/${event.link}`}
                >
                  <a>
                    <PencilIcon className="block h-4 w-4" aria-hidden="true" />
                  </a>
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
                  {dayjs(event.start_at).format("DD/MM/YYYY")} à{" "}
                  {dayjs(event.start_at).format("HH:mm")} au{" "}
                  {dayjs(event.end_at).format("DD/MM/YYYY")} à{" "}
                  {dayjs(event.end_at).format("HH:mm")}
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
                <button className="underline" onClick={() => openAddress()}>
                  {event.address}
                </button>
              </div>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <div className="text-sm font-medium text-gray-500">Lien</div>
              <div className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center">
                <LinkIcon className="block h-3 w-3 mr-2" aria-hidden="true" />
                <button className="underline" onClick={() => shareEvent()}>{`${typeof window !== "undefined"
                  ? `${window.location.host}/events/details/`
                  : ""
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
              <div className="text-sm flex justify-between	font-medium text-gray-500">
                <span>Invités</span>
                {event.invitations.length > 0 ? (
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
                  {responses.yes}: {event.comingGuestAmount}, {responses.no}:{" "}
                  {event.notComingGuestAmount}, {responses.maybe}:{" "}
                  {event.maybeComingGuestAmount}
                </p>
              </div>
              <div className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-1  flex items-center">
                <p>{userInvitationResponse}</p>
              </div>
            </div>
            {!isOrganizer && userChecked && (
              <div className="py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 flex justify-between">
                <button
                  onClick={() => setResponse(BoInvitationValidResponse.NO)}
                  className="btn border border-black p-2 btn-sm text-black hover:text-white hover:border-black hover:bg-black"
                >
                  Refuser
                </button>
                <button
                  onClick={() => setResponse(BoInvitationValidResponse.YES)}
                  className="btn border border-black p-2 btn-sm text-black ml-3 hover:text-white hover:border-black hover:bg-black"
                >
                  Accepter
                </button>
                <button
                  onClick={() => setResponse(BoInvitationValidResponse.MAYBE)}
                  className="btn border border-black p-2 btn-sm text-black ml-3 hover:text-white hover:border-black hover:bg-black"
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
