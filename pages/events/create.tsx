import type { NextPage } from "next";
import { useContext, useEffect, useState } from "react";
import Header from "@components/Header";
import { toast } from "react-toastify";
import { Form } from "@components/CreateEvent/Form/Form";
import type { Tform } from "@components/CreateEvent/Form/types";
import Loader from "@components/Loader";
import { useRouter } from "next/router";
import { fetcher } from "@src/utils/fetcher";
import { ManagedUI } from "@src/context/UIContext";

const Add: NextPage = () => {
  const { push } = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { setOpenModal, user, setUser } = useContext(ManagedUI);

  useEffect(() => {
    !user ? setOpenModal(true) : setOpenModal(false);
  }, [user]);

  return (
    <>
      <Header />
      <section className="pt-24 md:mt-0 min-h-screen pb-10 flex justify-center md:flex-row md:justify-between lg:px-48 md:px-12 px-4 bg-secondary">
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
            <div
              className={isLoading ? "filter blur-sm pointer-events-none" : ""}
            >
              <Form onSubmit={handleSubmit} />
            </div>
          </div>
        </div>
      </section>
    </>
  );

  function handleSubmit(
    e: React.FormEvent<HTMLFormElement>,
    { name, startAt, endAt, location, description, userName }: Tform,
    isValid: boolean
  ) {
    e.preventDefault();
    if (!isValid) {
      toast.error("Il y a des erreurs dans le formulaire");
      return;
    }
    setIsLoading(true);
    fetcher(`/api/events`, {
      method: "POST",
      body: JSON.stringify({
        title: name.value,
        start_at: Date.parse(startAt.value),
        end_at: Date.parse(endAt.value),
        address: location.value,
        description: description.value,
        user_id: user.id,
        user_name: userName.value,
      }),
    })
      .then((data) => {
        if (userName.value !== user.name) {
          setUser({ id: user.id, name: userName.value });
        }
        setIsLoading(false);
        push("/home");
      })
      .catch((err) => {
        setIsLoading(false);
        console.error(err);
      });
  }
};

export default Add;
