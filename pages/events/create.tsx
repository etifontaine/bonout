import type { NextPage } from "next";
import Head from "next/head";
import Router from "next/router";
import Header from "../../components/Header";
import { toast } from "react-toastify";
import { Form } from "../../components/CreateEvent/Form/Form";
import type { Tform } from "../../components/CreateEvent/Form/types";

const Add: NextPage = () => {
  return (
    <>
      <Head>
        <script
          defer
          src={`https://maps.googleapis.com/maps/api/js?key=AIzaSyAugCWPRmET1IH1TkplqNzrGMgK1yItKmM&libraries=places`}
        ></script>
      </Head>
      <div className="flex flex-col min-h-screen overflow-hidden">
        <Header />
        <main className="flex-grow">
          <section className="relative">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 sm:mt-10">
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
    });
  }
};

export default Add;
