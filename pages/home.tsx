import type { NextPage } from "next";
import Head from "next/head";
import Card from "../components/Card";
import EventItem from "../components/HomeScreen/EventItem";
import EventCard from "../components/HomeScreen/EventCard";
import {
  BoEvent,
  BoInvitationValidResponse,
} from "../src/types";

const Add: NextPage = () => {
  return (
    <div className="h-screen bg-gray-200">
      <Head>
        <title>Home</title>
      </Head>
      <main className="h-full">
        <h1 className="text-3xl font-medium w-2/3">
          Création d'un évenement
        </h1>
        <h2 className="text-2xl font-medium pt-4 pl-2 pb-2">
          C'est aujourd'hui !{" "}
        </h2>
        {/* <EventCard event={fakeEvent} /> */}

        <h2 className="text-2xl font-medium pt-4 pl-2 pb-2">
          À venir{" "}
        </h2>
        <section className="h-full bg-white">
          {/* {fakeEvents.map((event, index) => (
            <>
              <EventItem event={event} key={event.id} />
              {index !== fakeEvents.length - 1 ? (
                <Separator key={event.id + "sep"} />
              ) : null}
            </>
          ))} */}
        </section>
      </main>
    </div>
  );
};

function Separator() {
  return (
    <div className="bg-white">
      <div className="m-auto w-1/3 h-0.5 bg-blue-400"></div>
    </div>
  );
}

export default Add;
