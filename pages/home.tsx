import type { NextPage } from "next";
import Head from "next/head";
import EventItem from "../components/HomeScreen/EventItem";
import EventCard from "../components/HomeScreen/EventCard";
import Header from "../components/Header";
import { BoEvent } from "../src/types";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getUserID } from "src/utils/user";
import Router from "next/router";

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
    <div className="h-screen">
      <Head>
        <title>Bonout</title>
      </Head>
      <Header />
      <main className="flex-grow">
        <section className="relative">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            {/* Hero content */}
            <div className="pt-10 pb-12 md:pb-20">
              {/* Section header */}
              <div className=" pb-12 md:pb-16">
                <div className="max-w-3xl mx-auto">
                  {todayEvents !== null &&
                    todayEvents.map((event) => (
                      <div key={event.id}>
                        <h2 className="text-2xl font-medium pt-4 pl-2 pb-2">
                          C'est aujourd'hui !
                        </h2>
                        <EventCard event={event} />
                      </div>
                    ))}

                  {
                    events && events?.length > 0 ? (
                      <>
                        <h2 className="text-2xl font-medium pt-4 pl-2 pb-2">
                          Évenements à venir
                        </h2>
                        <section className="h-fullbg-gray-200">
                          {events.map((event, index) => (
                            <div key={event.id}>
                              <EventItem
                                onClick={() => Router.push(`/events/details/${event.link}`)}
                                event={event}
                              />
                              {index !== events.length - 1 ? <Separator /> : null}
                            </div>
                          ))}
                        </section>
                      </>
                    ) : null
                  }
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
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

function Separator() {
  return (
    <div className="bg-white">
      <div className="m-auto w-100 h-0.5 bg-blue-400"></div>
    </div>
  );
}

export default Home;
