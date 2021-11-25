import React, { useEffect, useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Router from "next/router";
import dayjs from "dayjs";
import Header from "../../../components/Header";
import Modal from "../../../components/Invitation/Modal";
import { BoEvent, BoInvitationValidResponse } from "../../../src/types";
import { getEventByLink } from "../../../src/models/events";
import { getUserID } from "src/utils/user";

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
    <div className="flex flex-col min-h-screen overflow-hidden">
      <Modal
        link={modalContent.link}
        userResponse={modalContent.userResponse}
      />
      {/*  Site header */}
      <Header />

      <div className="bg-white overflow-hidden sm:rounded-lg flex-grow">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {event.title}
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            {event.description}
          </p>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Date</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                Du {dayjs(event.start_at).format("DD/MM/YYYY")} à{" "}
                {dayjs(event.start_at).format("HH:mm")} au{" "}
                {dayjs(event.end_at).format("DD/MM/YYYY")} à{" "}
                {dayjs(event.end_at).format("HH:mm")}
              </dd>
            </div>
            <div className="bg-white px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Adresse</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <button onClick={() => openAddress()}>{event.address}</button>
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Lien</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <button onClick={() => shareEvent()}>{`${typeof window !== "undefined"
                    ? `${window.location.host}/events/details/`
                    : ""
                  }${event.link}`}</button>
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Organisateur
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {getUserID() === event.user_id
                  ? "C'est votre événement"
                  : "privé"}
              </dd>
            </div>
            <div className="bg-white px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Invités</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-1">
                <p>
                  Yes: {event.comingGuestAmount}, No:{" "}
                  {event.notComingGuestAmount}, Maybe:{" "}
                  {event.maybeComingGuestAmount}
                </p>
              </dd>
              <dd className="mt-1 text-sm text-gray-900 mt-10 sm:col-span-1">
                <ul
                  role="list"
                  className="border border-gray-200 rounded-md divide-y divide-gray-200 max-h-30 overflow-y-auto"
                >
                  {event.invitations.map((invitation, key) => {
                    return (
                      <li
                        key={key}
                        className="pl-3 pr-4 py-3 flex items-center justify-between text-sm"
                      >
                        <div className="w-0 flex-1 flex items-center">
                          <span className="ml-2 flex-1 w-0 truncate">
                            {invitation.name}
                          </span>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          {invitation.response}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <button
                onClick={() => setResponse(BoInvitationValidResponse.NO)}
                className="btn-sm text-black bg-gray-300 hover:bg-gray-400 ml-3"
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
          </dl>
        </div>
      </div>
      <footer className="h-5">user_id: {getUserID()}</footer>
    </div>
  );
};

export default EventDetails;
