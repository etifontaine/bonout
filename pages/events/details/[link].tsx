import React, { useEffect, useState } from "react";
import type { NextPage } from "next";
import Router from "next/router";
import Head from "next/head";
import dayjs from "dayjs";
import Header from "../../../components/Header";
import Modal from "../../../components/Invitation/Modal";
import GuestListModal from "../../../components/GuestListModal";
import { BoEvent, BoInvitationValidResponse } from "../../../src/types";
import { getEventByLink } from "../../../src/models/events";
import { getUserID } from "src/utils/user";
import {
  CalendarIcon,
  LinkIcon,
  LocationMarkerIcon,
  PencilIcon,
  UserGroupIcon,
  UserIcon,
} from "@heroicons/react/outline";
import { toast } from "react-toastify";

interface PageProps {
  event: BoEvent & { comingGuestAmount: number };
}

export interface IModal {
  link?: BoEvent["link"];
  userResponse?: BoInvitationValidResponse;
}

export async function getServerSideProps(context: { query: { link: string } }) {
  const { link } = context.query;
  const event = await getEventByLink(link);

  const cleanedEvent = {
    address: event?.address,
    description: event?.description,
    start_at: event?.start_at,
    end_at: event?.end_at,
    link: event?.link,
    title: event?.title,
    user_id: event?.user_id,
    invitations: event?.invitations || [],
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

  const [modalContent, setModal] = useState<IModal>({});
  const [isGuestListVisible, setGuestListVisible] = useState(false);
  const [userInvitationStatus, setUserInvitationStatus] = useState<string>();

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

  useEffect(() => {
    if (event.invitations.length > 0) {
      const userInvitation = event.invitations.find(
        (invitation) => invitation.user_id === getUserID()
      );
      if (userInvitation?.response === BoInvitationValidResponse.YES) {
        setUserInvitationStatus("Vous avez prévu de venir");
      } else if (userInvitation?.response === BoInvitationValidResponse.MAYBE) {
        setUserInvitationStatus("Vous avez peut-être prévu de venir");
      } else if (userInvitation?.response === BoInvitationValidResponse.NO) {
        setUserInvitationStatus("Vous n'avez pas prévu de venir");
      }
    } else {
      setUserInvitationStatus("Vous n'avez pas encore répondu à l'invitation");
    }
  }, [event]);

  return (
    <>
      <Head>
        <meta property="og:title" content={`Bonout - ${event.title}`} />
        <meta property="og:description" content={`${event.description}`} />
      </Head>
      <Modal
        link={modalContent.link}
        userResponse={modalContent.userResponse}
      />
      <GuestListModal
        isVisible={isGuestListVisible}
        setGuestListVisible={setGuestListVisible}
        guests={event.invitations}
      />
      {/*  Site header */}
      <Header />
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="bg-white overflow-hidiven sm:rounded-lg flex-grow">
          <div className="px-4 py-5 sm:px-6 grid grid-cols-5">
            <div className="col-span-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {event.title}
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                {event.description}
              </p>
            </div>
            {getUserID() === event.user_id ? (
              <div className="flex justify-end items-center">
                <button
                  onClick={() => {
                    toast.info("Tu ne peux pas encore éditer un événement 😕");
                  }}
                >
                  <PencilIcon className="block h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            ) : null}
          </div>
          <div className="border-t border-gray-200">
            <div>
              <div className="bg-gray-50 px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <div className="text-sm font-medium text-gray-500">Date</div>
                <div className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center">
                  <CalendarIcon
                    className="block h-3 w-3 mr-2"
                    aria-hidden="true"
                  />
                  Du {dayjs(event.start_at).format("DD/MM/YYYY")} à{" "}
                  {dayjs(event.start_at).format("HH:mm")} au{" "}
                  {dayjs(event.end_at).format("DD/MM/YYYY")} à{" "}
                  {dayjs(event.end_at).format("HH:mm")}
                </div>
              </div>
              <div className="bg-white px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
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
              <div className="bg-gray-50 px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <div className="text-sm font-medium text-gray-500">Lien</div>
                <div className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center">
                  <LinkIcon className="block h-3 w-3 mr-2" aria-hidden="true" />
                  <button
                    className="underline"
                    onClick={() => shareEvent()}
                  >{`${typeof window !== "undefined"
                    ? `${window.location.host}/events/details/`
                    : ""
                    }${event.link}`}</button>
                </div>
              </div>
              <div className="bg-white px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <div className="text-sm font-medium text-gray-500">
                  Organisateur
                </div>
                <div className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center">
                  <UserIcon className="block h-3 w-3 mr-2" aria-hidden="true" />
                  {getUserID() === event.user_id
                    ? "C'est votre événement"
                    : "privé"}
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <div className="text-sm flex justify-between	font-medium text-gray-500">
                  <span>Invités</span>
                  {
                    event.invitations.length > 0 ?
                      (
                        <button
                          className="text-yellow-500 text-sm"
                          onClick={() => setGuestListVisible(true)}
                        >
                          Voir la liste
                        </button>
                      )
                      : null
                  }
                </div>
                <div className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-1  flex items-center">
                  <UserGroupIcon
                    className="block h-3 w-3 mr-2"
                    aria-hidden="true"
                  />
                  <p>
                    Yes: {event.comingGuestAmount}, No:{" "}
                    {event.notComingGuestAmount}, Maybe:{" "}
                    {event.maybeComingGuestAmount}
                  </p>
                </div>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 flex justify-between">
                <button
                  onClick={() => setResponse(BoInvitationValidResponse.NO)}
                  className="btn-sm text-black bg-gray-300 hover:bg-gray-400"
                >
                  Refuser
                </button>
                <button
                  onClick={() => setResponse(BoInvitationValidResponse.YES)}
                  className="btn-sm text-green-600 bg-gray-300 hover:bg-gray-400 ml-3"
                >
                  Accepter
                </button>
                <button
                  onClick={() => setResponse(BoInvitationValidResponse.MAYBE)}
                  className="btn-sm text-black bg-gray-300 hover:bg-gray-400 ml-3"
                >
                  Peut-être
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EventDetails;
