import type { NextPage } from "next";
import EventItem from "../components/HomeScreen/EventItem";
import EventCard from "../components/HomeScreen/EventCard";
import Header from "../components/Header";
import { BoEvent } from "../src/types";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getUserID } from "src/utils/user";
import Router from "next/router";
import Head from "next/head";

const Home: NextPage = () => {
  const [events, setEvents] = useState<BoEvent[] | null>(null);
  const [todayEvents, setTodayEvents] = useState<BoEvent[] | null>(null);

  useEffect(() => {
    fetchEvents(getUserID())
      .then((events) => {
        setEvents(getComingEvents(events));
        setTodayEvents(getTodayEvents(events));
      })
      .catch((err) => {
        console.log(err);
        toast.error("Can't get events");
      });
  }, []);

  return (
    <div>
      <Head>
        <title>Bonout - Mes événements</title>
        <meta property="og:title" content="Bonout - Mes événements" />
        <meta
          name="description"
          content="Bonout t'aide à organiser ton prochain événement, un seul site avec toutes les fonctionnalités!"
        />
        <meta charSet="utf-8" />
        <link rel="icon" href="/images/logo.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <Header />
      <section className="pt-24 md:mt-0 h-screen flex justify-center md:flex-row md:justify-between lg:px-48 md:px-12 px-4 bg-secondary">
        <div className="md:max-w-3xl mx-auto w-full text-left">
          {todayEvents !== null && todayEvents.length > 0 && (
            <>
              <h2 className="text-2xl font-medium pt-4 pb-2">
                C'est aujourd'hui !
              </h2>
              {todayEvents.map((event, index) => (
                <div key={event.id}>
                  <EventCard event={event} />
                  {index !== todayEvents.length - 1 ? (
                    <Separator color="blue-400" />
                  ) : null}
                </div>
              ))}
            </>
          )}

          {events && events?.length > 0 ? (
            <>
              <h2 className="text-2xl font-medium mt-4 pb-2">
                Évenements à venir
              </h2>
              <section className="h-full bg-gray-200">
                {events.map((event, index) => (
                  <div key={event.id}>
                    <EventItem
                      onClick={() =>
                        Router.push(`/events/details/${event.link}`)
                      }
                      event={event}
                    />
                    {index !== events.length - 1 ? <Separator /> : null}
                  </div>
                ))}
              </section>
            </>
          ) : null}
        </div>
      </section>
    </div>
  );

  async function fetchEvents(userID: string | null): Promise<BoEvent[] | []> {
    return (await fetch(`/api/users/${userID}/events`).then((res) => {
      if (res.status !== 200) return [];
      return res.json();
    })) as Promise<BoEvent[]>;
  }

  function getTodayEvents(events: BoEvent[]): BoEvent[] | null {
    return events.filter(({ start_at }) => isToday(start_at));
  }

  function getComingEvents(events: BoEvent[]): BoEvent[] | null {
    return events.filter(({ start_at }) => !isToday(start_at));
  }

  function isToday(dateString: string) {
    const date = new Date(dateString);
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }
};

function Separator({ color }: { color?: string }) {
  return (
    <div className={`bg-${color || "white"}`}>
      <div className="m-auto w-100 h-0.5 bg-blue-400"></div>
    </div>
  );
}

export default Home;
