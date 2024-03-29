import type { NextPage } from "next";
import { useRouter } from "next/router";
import Header from "@components/Header";
import { toast } from "react-toastify";
import { Form } from "@components/CreateEvent/Form/Form";
import type { Tform } from "@components/CreateEvent/Form/types";
import Link from "next/link";
import { ManagedUI } from "@src/context/UIContext";
import { useContext } from "react";
import { getEventByLink } from "@src/events";

export async function getServerSideProps(context) {
  const event = await getEventByLink(context.params.link);
  return {
    props: {
      event,
    },
  };
}

const EditEvent: NextPage = (props: any) => {
  const { push } = useRouter();
  const { user } = useContext(ManagedUI);

  const data = props.event;

  return (
    <>
      <Header />
      {data && user && (
        <section className="pt-24 md:mt-0 h-screen flex justify-center md:flex-row md:justify-between lg:px-48 md:px-12 px-4 bg-secondary">
          <div className="md:max-w-3xl mx-auto w-full text-left">
            {data.user.name === user.name ? (
              <>
                <h1 className="text-3xl md:text-5xl font-extrabold leading-tighter tracking-tighter mb-4 mt-5">
                  Modification de l'événement
                </h1>
                <div className="max-w-3xl mt-5 mx-auto relative">
                  <Form event={data} onSubmit={handleSubmit} />
                </div>
              </>
            ) : (
              <>
                <h1 className="text-3xl md:text-5xl font-extrabold leading-tighter tracking-tighter mb-4 mt-5">
                  {data.title}
                </h1>
                <h1 className="text-3xl md:text-5xl font-extrabold leading-tighter tracking-tighter mb-4 mt-5">
                  Vous n'etes pas autorisé à modifier cet événement
                </h1>
                <Link
                  href="/events/details/[link]"
                  as={`/events/details/${data.link}`}
                  className="text-lg font-semibold text-center mt-5 underline"
                >
                  {"<"} Retourner à l'événement
                </Link>
              </>
            )}
          </div>
        </section>
      )}
    </>
  );

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>,
    { name, startAt, endAt, location, description, userName }: Tform,
    isValid: boolean
  ) {
    e.preventDefault();
    if (!isValid || !data) {
      toast.error("Il y a des erreurs dans le formulaire");
      return;
    }

    try {
      const res = await fetch(`/api/events/${data.link}`, {
        method: "PUT",
        body: JSON.stringify({
          name: name.value,
          startAt: Date.parse(startAt.value),
          endAt: Date.parse(endAt.value),
          address: location.value,
          description: description.value,
        }),
      });
      if (res.status !== 200) {
        toast.error("Une erreur est survenue");
      } else {
        push({
          pathname: `/events/details/${data.link}`,
        });
      }
    } catch (e) {
      toast.error("Une erreur est survenue");
    }
  }
};

export default EditEvent;
