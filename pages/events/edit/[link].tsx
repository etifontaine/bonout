import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Header from "@components/Header";
import { toast } from "react-toastify";
import { Form } from "@components/CreateEvent/Form/Form";
import type { Tform } from "@components/CreateEvent/Form/types";
import Loader from "@components/Loader";
import { BoEvent } from "src/types";
import { getUserID } from "src/utils/user";
import Link from "next/link";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "@src/firebase/client";

const EditEvent: NextPage = () => {
    const { query, push } = useRouter()
    const [isLoading, setIsLoading] = useState(false);
    const [event, setEvent] = useState<BoEvent>();
    const [isOrganizer, setIsOrganizer] = useState(false);

    useEffect(() => {
        setIsLoading(true)
        getDocs(collection(db, `${process.env.NEXT_PUBLIC_DB_ENV}_events`)).then(querySnapshot => {
            querySnapshot.forEach((doc) => {
                if (doc.data().link === query.link) {
                    let event = doc.data() as BoEvent;
                    event.id = doc.id
                    setIsOrganizer(doc.data().user_id === getUserID())
                    setEvent(event)
                }
            })
        }).finally(() => setIsLoading(false))
    }, [query]);

    if (!event) {
        return null
    }

    return (
        <>
            <Header />
            <section className="pt-24 md:mt-0 h-screen flex justify-center md:flex-row md:justify-between lg:px-48 md:px-12 px-4 bg-secondary">
                <div className="md:max-w-3xl mx-auto w-full text-left">
                    {isOrganizer || isLoading ? (
                        <>
                            <h1 className="text-3xl md:text-5xl font-extrabold leading-tighter tracking-tighter mb-4 mt-5">
                                Modification de l'événement
                            </h1>
                            <div className="max-w-3xl mt-5 mx-auto relative">
                                {isLoading && (
                                    <div className="absolute top-0 left-0 right-0 bottom-0">
                                        <Loader />
                                    </div>
                                )}

                                <div
                                    className={
                                        isLoading ? "filter blur-sm pointer-events-none" : ""
                                    }
                                >
                                    <Form event={event} onSubmit={handleSubmit} />
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <h1 className="text-3xl md:text-5xl font-extrabold leading-tighter tracking-tighter mb-4 mt-5">
                                {event.title}
                            </h1>
                            <h1 className="text-3xl md:text-5xl font-extrabold leading-tighter tracking-tighter mb-4 mt-5">
                                Vous n'etes pas autorisé à modifier cet événement
                            </h1>
                            <Link
                                href="/events/details/[link]"
                                as={`/events/details/${event.link}`}
                            >
                                <a className="text-lg font-semibold text-center mt-5 underline">
                                    {"<"} Retourner à l'événement
                                </a>
                            </Link>
                        </>
                    )}
                </div>
            </section>
        </>
    );

    function handleSubmit(
        e: React.FormEvent<HTMLFormElement>,
        { name, startAt, endAt, location, description, userName }: Tform,
        isValid: boolean
    ) {
        setIsLoading(false);
        e.preventDefault();
        if (!isValid || !event) {
            toast.error("Il y a des erreurs dans le formulaire");
            return;
        }
        setIsLoading(true);

        updateDoc(doc(db, `${process.env.NEXT_PUBLIC_DB_ENV}_events`, event.id), {
            user_name: userName.value,
            title: name.value,
            start_at: new Date(startAt.value).toISOString(),
            end_at: new Date(endAt.value).toISOString(),
            address: location.value,
            description: description.value,
        })
        setIsLoading(false);
        push({
            pathname: `/events/details/${event.link}`,
        })
    }
};

export default EditEvent;