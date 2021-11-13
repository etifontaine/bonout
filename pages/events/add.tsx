import type { NextPage } from "next";
import Input from "../../components/Input";
import Head from "next/head";
import { useState } from "react";

const Add: NextPage = () => {
  return (
    <div className="font-sans">
      <Head>
        <title>Créer un évemment</title>
        <meta
          name="description"
          content="Créé un évenement Bonout"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="">
        <h1 className="text-3xl font-medium w-2/3">
          Création d'un évenement
        </h1>
      </main>
      <Form />
    </div>
  );
};

function Form() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    fetch("/api/events", {
      method: "POST",
      body: JSON.stringify({
        title,
        start_at: date,
        end_at: date,
        address: location,
        description,
      }),
    });
  };
  return (
    <form onSubmit={handleSubmit} className="pt-3">
      <div className="flex flex-wrap">
        <Input
          id="name"
          label="Un nom ?"
          placeholder="Nom de l'évenement"
          onChange={setTitle}
          value={title}
        />
        <Input
          id="date"
          label="Quel jour ?"
          onChange={setDate}
          value={date}
          type="date"
        />
        <Input
          id="location"
          label="Un lieu ?"
          placeholder="Lieu de l'évenement"
          onChange={setLocation}
          value={location}
        />
        <Input
          id="description"
          label="Quelque infos ?"
          placeholder="Description de l'évenement"
          onChange={setDescription}
          value={description}
          type="textarea"
        />
      </div>
      <input
        value="Créer"
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full float-right"
      />
    </form>
  );
}

export default Add;
