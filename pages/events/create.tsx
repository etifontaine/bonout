import type { NextPage } from "next";
import Input from "../../components/Input";
import Head from "next/head";
import Router from "next/router";
import Header from "../../components/Header";
import { toast } from "react-toastify";
import { Form } from "../../components/CreateEvent/Form/Form";
import type { Tform } from "../../components/CreateEvent/Form/types";

const Add: NextPage = () => {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <Head>
        <title>Bonout</title>
        <meta
          name="description"
          content="Bonout t'aide à organiser ton prochain événement, un seul site avec toutes les fonctionnalités!"
        />
        <meta charSet="utf-8" />
        <link rel="icon" href="/images/logo.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
      </Head>
      <Header />
      <main className="flex-grow">
        <section className="relative">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            {/* Hero content */}
            <div className="pb-12 pt-10 md:pb-20">
              {/* Section header */}
              <div className="text-center pb-12 md:pb-16">
                <h1 className="text-4xl md:text-5xl font-extrabold leading-tighter tracking-tighter mb-4">
                  Création d'un événement
                </h1>
                <div className="max-w-3xl mx-auto">
                  <Form onSubmit={handleSubmit} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
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
    }).then(async (res) => {
      if (res.status === 201) {
        const { link, user_id } = await res.json();
        Router.push(`/invitation/${link}`);
        if (localStorage.getItem("user_id") === null) {
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
    });
  }
};

export default Add;
