import React, { useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Router from "next/router";
import dayjs from 'dayjs'
import Header from "../../components/Header";
import Modal from "../../components/Invitation/Modal";
import { BoEvent, BoInvitationValidResponse } from "../../src/types";
import { getEventByLink } from "../../src/models/events";

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
    comingGuestAmount: event?.comingGuestAmount,
    maybeComingGuestAmount: event?.maybeComingGuestAmount,
  };

  return {
    props: {
      event: cleanedEvent,
    },
  };
}

const Invitation: NextPage<PageProps> = ({ event }) => {
  if (!event) {
    Router.push("/home");
  }

  const [modalContent, setModal] = useState<IModal>({});

  const setResponse = (userResponse: BoInvitationValidResponse) => {
    setModal({ userResponse, link: event.link });
  };

  const shareEvent = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.description,
        url: event.link,
      })
        .catch((error) => console.log('Error sharing', error));
    }
  }

  const openAddress = () => {
    let address = event.address.replace(/\s\s+/g, " "); // remove spaces
    address = encodeURIComponent(address);

    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (isSafari) {
      window.open('http://maps.apple.com/?q=' + address);
    } else { /* else use Google */
      window.open('https://maps.google.com/maps?q=' + address);
    }
  }

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <Head>
        <title>Bonout - Invitation</title>
        <meta
          name="description"
          content="Bonout t'aide à organiser ton prochain événement, un seul site avec toutes les fonctionnalités!"
        />
        <meta charSet="utf-8" />
        <link rel="icon" href="/images/logo.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
      </Head>
      <Modal
        link={modalContent.link}
        userResponse={modalContent.userResponse}
      />
      {/*  Site header */}
      <Header />
      {/*  Page content */}
      <main className="flex-grow">
        <section className="relative">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            {/* Hero content */}
            <div className="pt-32 pb-12 md:pt-40 md:pb-20">
              {/* Section header */}
              <div className="text-center pb-12 md:pb-16">
                <h1 className="text-4xl md:text-5xl font-extrabold leading-tighter tracking-tighter mb-4">
                  {event.title}
                </h1>
                <div className="max-w-3xl mx-auto">
                  <p className="text-xl text-gray-600 mb-8">
                    {event.description}
                  </p>
                  <p className="text-xl text-gray-600 mb-8">
                    Du {dayjs(event.start_at).format('DD/MM/YYYY')} à {dayjs(event.start_at).format('HH:mm')} au {dayjs(event.end_at).format('DD/MM/YYYY')} à {dayjs(event.end_at).format('HH:mm')}
                  </p>
                  <p className="text-xl text-gray-600 mb-8">
                    Adresse: <button onClick={() => openAddress()}>{event.address}</button>
                  </p>
                  <p className="text-xl text-gray-600 mb-8">
                    Lien: <button onClick={() => shareEvent()}>{event.link}</button>
                  </p>
                  {event.comingGuestAmount > 0 ? (
                    <p className="text-xl text-gray-600 mb-8">
                      Déjà {event.comingGuestAmount} personne
                      {event.comingGuestAmount > 1 ? "s ont" : "à"} prévu de
                      venir
                    </p>
                  ) : null}
                </div>
                <div>
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
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Invitation;
