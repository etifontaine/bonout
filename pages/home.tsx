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
import Skeleton from "react-loading-skeleton";

const Home: NextPage = () => {
  const [events, setEvents] = useState<BoEvent[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
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
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div>
      <Head>
        <title>Bonout - Mes événements</title>
        <meta property="og:title" content="Bonout - Mes événements" />
        <meta
          property="og:image"
          content={`${process.env.NEXT_PUBLIC_BASE_URL}/header-30112021.png`}
        />
        <meta
          name="description"
          content="Bonout t'aide à organiser ton prochain événement, un seul site avec toutes les fonctionnalités!"
        />
      </Head>
      <Header />
      <section className="pt-24 md:mt-0 min-h-screen flex justify-center md:flex-row md:justify-between lg:px-48 md:px-12 px-4 bg-secondary">
        {isLoading ? (
          <div className="md:max-w-3xl mx-auto w-full">
            <Skeleton height={80} count={2} style={{ marginBottom: "5px" }} />
          </div>
        ) : (
          <div className="md:max-w-3xl mx-auto w-full">
            {todayEvents !== null && todayEvents.length > 0 && (
              <>
                <h2 className="text-2xl font-medium pt-4 pb-2">
                  C'est aujourd'hui !
                </h2>
                {todayEvents
                  .sort((a, b) => isPassed(a.start_at, b.start_at))
                  .map((event, index) => (
                    <div key={event.id}>
                      <EventCard event={event} />
                      {index !== todayEvents.length - 1 ? (
                        <Separator color="transparent" />
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
                <section className="">
                  {events
                    .sort((a, b) => isPassed(a.start_at, b.start_at))
                    .map((event, index) => (
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
            ) : (
              <h2 className="text-2xl font-medium mt-20 pb-2 text-center">
                Aucun événement à venir
              </h2>
            )}
          </div>
        )}
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

  function isPassed(dateString: string, dateString2: string) {
    const date = new Date(dateString);
    const date2 = new Date(dateString2);
    return date.getTime() - date2.getTime();
  }
};

function Separator({ color }: { color?: string }) {
  return (
    <div className={`${color || "bg-white"}`}>
      <div className="m-auto w-100 h-0.5 "></div>
    </div>
  );
}

export default Home;
