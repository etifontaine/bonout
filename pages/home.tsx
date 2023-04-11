import type { NextPage } from "next";
import { parse } from "cookie";
import EventItem from "../components/HomeScreen/EventItem";
import EventCard from "../components/HomeScreen/EventCard";
import Header from "../components/Header";
import Router, { useRouter } from "next/router";
import Head from "next/head";
import Skeleton from "react-loading-skeleton";
import { getUserEvents } from "@src/events";
import { useContext, useEffect } from "react";
import { ManagedUI } from "@src/context/UIContext";

export async function getServerSideProps(context) {
  const cookies = context.req.headers.cookie;
  let data = {
    todayEvents: [],
    events: [],
  };
  if (cookies) {
    const parsedCookie = parse(cookies);
    const userPayload = parsedCookie["bonout-user"];
    if (userPayload) {
      const user = JSON.parse(userPayload);
      data = await getUserEvents(user.id);
    }
  }
  return {
    props: {
      data,
    },
  };
}

const Home: NextPage = ({ data }: any) => {
  const router = useRouter();
  const { user } = useContext(ManagedUI);

  const refreshData = () => {
    router.replace(router.asPath);
  };

  useEffect(() => {
    refreshData();
  }, [user]);

  return (
    <div>
      <Head>
        <title>Bonout - Mes événements</title>
        <meta
          property="og:title"
          content="Bonout t'aide à organiser ton prochain événement, un seul site avec toutes les fonctionnalités!"
        />
        <meta
          property="og:image"
          content="https://bonout.com/header-30112021.png"
        />
        <meta
          name="description"
          content="Bonout t'aide à organiser ton prochain événement, un seul site avec toutes les fonctionnalités!"
        />
      </Head>
      <Header />
      <section className="pt-24 md:mt-0 min-h-screen flex justify-center md:flex-row md:justify-between lg:px-48 md:px-12 px-4 bg-secondary">
        {!data ? (
          <div className="md:max-w-3xl mx-auto w-full">
            <Skeleton height={80} count={2} style={{ marginBottom: "5px" }} />
          </div>
        ) : (
          <div className="md:max-w-3xl mx-auto w-full">
            {data.todayEvents !== null && data.todayEvents?.length > 0 && (
              <>
                <h2 className="text-2xl font-medium pt-4 pb-2">
                  C'est aujourd'hui !
                </h2>
                {data.todayEvents
                  .sort((a, b) => isPassed(a.start_at, b.start_at))
                  .map((event, index) => (
                    <div key={index}>
                      <EventCard event={event} />
                      {index !== data.todayEvents?.length - 1 ? (
                        <Separator color="transparent" />
                      ) : null}
                    </div>
                  ))}
              </>
            )}

            {data.events && data.events?.length > 0 ? (
              <>
                <h2 className="text-2xl font-medium mt-4 pb-2">
                  Évenements à venir
                </h2>
                <section className="">
                  {data.events
                    .sort((a, b) => isPassed(a.start_at, b.start_at))
                    .map((event, index) => (
                      <div key={index}>
                        <EventItem
                          onClick={() =>
                            Router.push(`/events/details/${event.link}`)
                          }
                          event={event}
                        />
                        {index !== data.events.length - 1 ? (
                          <Separator />
                        ) : null}
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
