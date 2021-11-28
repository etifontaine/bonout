import type { NextPage } from "next";
import { useState } from "react";
import Script from "next/script";
import Router from "next/router";
import Header from "../../components/Header";
import { toast } from "react-toastify";
import { Form } from "../../components/CreateEvent/Form/Form";
import type { Tform } from "../../components/CreateEvent/Form/types";
import Loader from "@components/Loader";

const Add: NextPage = () => {
  const [gmapIsLoad, setGmapIsLoad] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  if (typeof window !== "undefined") {
    if (window.google && !gmapIsLoad) {
      setGmapIsLoad(true);
    }
  }
  return (
    <>
      <Script
        onLoad={() => setGmapIsLoad(true)}
        defer
        src={`https://maps.googleapis.com/maps/api/js?key=AIzaSyAugCWPRmET1IH1TkplqNzrGMgK1yItKmM&libraries=places`}
      ></Script>
      <Header />
      <section className="pt-24 md:mt-0 h-screen flex justify-center md:flex-row md:justify-between lg:px-48 md:px-12 px-4 bg-secondary">
        <div className="md:max-w-3xl mx-auto w-full text-left">
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tighter tracking-tighter mb-4 mt-5">
            Créer un événement
          </h1>
          <div className="max-w-3xl mt-5 mx-auto relative">
            {isLoading && (
              <div className="absolute top-0 left-0 right-0 bottom-0">
                <Loader />
              </div>
            )}
            {gmapIsLoad && (
              <div
                className={
                  isLoading ? "filter blur-sm pointer-events-none" : ""
                }
              >
                <Form onSubmit={handleSubmit} />
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );

  function handleSubmit(
    e: React.FormEvent<HTMLFormElement>,
    { name, startAt, endAt, location, description }: Tform,
    isValid: boolean
  ) {
    e.preventDefault();
    if (!isValid) {
      toast.error("Il y a des erreurs dans le formulaire");
      return;
    }
    setIsLoading(true);
    fetch("/api/events", {
      method: "POST",
      body: JSON.stringify({
        title: name.value,
        start_at: startAt.value,
        end_at: endAt.value,
        address: location.value,
        description: description.value,
        user_id: localStorage.getItem("user_id") || undefined,
      }),
    })
      .then(async (res) => {
        if (res.status === 201) {
          const { link, user_id } = await res.json();
          Router.push(`/events/details/${link}`);
          if (
            localStorage.getItem("user_id") === null ||
            localStorage.getItem("user_id") === "undefined"
          ) {
            localStorage.setItem("user_id", user_id);
          }
        } else {
          res
            .json()
            .then((data) => {
              toast.error(data.error ? data.error : "Une erreur est survenue");
            })
            .catch(() => {
              toast.error("Une erreur est survenue");
            });
        }
      })
      .finally(() => setIsLoading(false));
  }
};

export default Add;
