import type { NextPage } from "next";
import { useState } from "react";
import Header from "@components/Header";
import { toast } from "react-toastify";
import { Form } from "@components/CreateEvent/Form/Form";
import type { Tform } from "@components/CreateEvent/Form/types";
import Loader from "@components/Loader";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@src/firebase/client";
import { useRouter } from "next/router";
import ShortUniqueId from "short-unique-id";

const Add: NextPage = () => {
  const { push } = useRouter()
  const [isLoading, setIsLoading] = useState(false);
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
    setIsLoading(false);
    const uid = new ShortUniqueId({ length: 10 });
    addDoc(collection(db, `${process.env.NEXT_PUBLIC_DB_ENV}_events`), {
      title: name.value,
      start_at: new Date(startAt.value).toISOString(),
      end_at: new Date(endAt.value).toISOString(),
      address: location.value,
      description: description.value,
      user_id: localStorage.getItem("user_id") || undefined,
      user_name: userName.value,
      link: uid(),
      created_at: new Date().toISOString(),
    }).then(() => {
      setIsLoading(false);
      push('/home')
    })
  }
};

export default Add;
