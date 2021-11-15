import type { NextPage } from "next";
import Input from "../../components/Input";
import Head from "next/head";
import Router from "next/router";
import Header from "../../components/Header";
import { MouseEventHandler, useState } from "react";
import { toast } from "react-toastify";
import usePlacesAutocomplete from "use-places-autocomplete";
import useOnclickOutside from "react-cool-onclickoutside";

const Add: NextPage = () => {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <Head>
        <title>Bonout - Invitation</title>
        <meta
          name="description"
          content="Bonout t'aide à organiser ton prochain événement, un seul site avec toutes les fonctionnalités!"
        />
        <meta charSet="utf-8" />
        <link rel="icon" href="/images/logo.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <script
          async
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}&libraries=places&callback=initMap`}
        ></script>
        <script>{"function initMap() {}"}</script>
      </Head>
      <Header />
      <main className="flex-grow">
        <section className="relative">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            {/* Hero content */}
            <div className="pt-32 pb-12 md:pt-40 md:pb-20">
              {/* Section header */}
              <div className="text-center pb-12 md:pb-16">
                <h1 className="text-4xl md:text-5xl font-extrabold leading-tighter tracking-tighter mb-4">
                  Création d'un événement
                </h1>
                <div className="max-w-3xl mx-auto">
                  <Form />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
type defaultInputState = {
  value: string;
  isValid: boolean;
  helperText: string;
  isTouched: boolean;
};
function Form() {
  const defaultInputState: defaultInputState = {
    value: "",
    isValid: false,
    helperText: "",
    isTouched: false,
  };
  const [title, setTitle] = useState(defaultInputState);
  const [description, setDescription] = useState(defaultInputState);
  const [date, setDate] = useState(defaultInputState);
  const [location, setLocation] = useState(defaultInputState);

  const isFormValid =
    title.isValid && description.isValid && date.isValid && location.isValid;

  const ref = useOnclickOutside(() => {
    // When user clicks outside of the component, we can dismiss
    // the searched suggestions by calling this method
    clearSuggestions();
  });

  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      /* Define search scope here */
    },
    debounce: 300,
  });

  const handleTitleChange = (value: string) => {
    const isValid = isLongEnough(value);
    setTitle({
      value,
      isTouched: true,
      isValid,
      helperText: isValid ? "" : "Le titre doit contenir au moins 5 caractères",
    });
  };

  const handleDescriptionChange = (value: string) => {
    const isValid = isLongEnough(value);
    setDescription({
      value,
      isTouched: true,
      isValid,
      helperText: isValid
        ? ""
        : "La description doit contenir au moins 5 caractères",
    });
  };

  const handleDateChange = (value: string) => {
    const isValid = isNotPassedDate(value);
    setDate({
      value,
      isTouched: true,
      isValid,
      helperText: isValid ? "" : "La date doit être postérieure à aujourd'hui",
    });
  };

  const handleLocationChange = (value: string) => {
    setValue(value);
    setLocation({
      ...location,
      isValid: false,
      isTouched: true,
      helperText: "Veuillez choisir une adresse",
    });
    clearSuggestions();
  };

  const handleSelect = (suggestion: any) => {
    setValue(suggestion.description, false);
    setLocation({
      ...location,
      value: suggestion.description,
      helperText: "",
      isValid: true,
    });
    clearSuggestions();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isFormValid) {
      fetch("/api/events", {
        method: "POST",
        body: JSON.stringify({
          title: title.value,
          start_at: date.value,
          end_at: date.value,
          address: location.value,
          description: description.value,
        }),
      }).then(async (res) => {
        if (res.status === 201) {
          const { message } = await res.json();
          Router.push(`/invitation/${message}`);
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
    } else {
      toast.error("Il y a des erreurs dans le formulaire");
    }
  };
  return (
    <form onSubmit={handleSubmit} className="pt-3">
      <div className="flex flex-wrap">
        <Input
          id="name"
          label="Un nom ?"
          placeholder="Nom de l'évenement"
          onChange={handleTitleChange}
          value={title.value}
          helperText={title.helperText}
          className={setInvalidClass(title)}
          required={true}
        />
        <Input
          id="date"
          label="Quel jour ?"
          onChange={handleDateChange}
          value={date.value}
          type="datetime-local"
          helperText={date.helperText}
          required={true}
          className={setInvalidClass(date)}
        />
        <div ref={ref} className="relative w-full">
          <Input
            id="location"
            label="Un lieu ?"
            placeholder="Lieu de l'évenement"
            onChange={handleLocationChange}
            value={value}
            className={setInvalidClass(location)}
            helperText={location.helperText}
            required={true}
          />
          <SuggestionList handleSelect={handleSelect} suggestions={data} />
        </div>
        <Input
          id="description"
          label="Quelque infos ?"
          placeholder="Description de l'évenement"
          onChange={handleDescriptionChange}
          helperText={description.helperText}
          value={description.value}
          type="textarea"
          className={setInvalidClass(description)}
          required={true}
        />
      </div>
      <input
        value="Créer"
        // disabled={!isFormValid}
        type="submit"
        className={`
        ${isFormValid ? "" : "cursor-not-allowed opacity-30"}
        bg-blue-500
        cursor-pointer
        hover:bg-blue-700
        text-white
        font-bold
        py-2 px-4
        rounded-full float-right`}
      />
    </form>
  );
}

function SuggestionList(props: {
  suggestions: google.maps.places.AutocompletePrediction[];
  handleSelect: CallableFunction;
}) {
  return props.suggestions.length > 0 ? (
    <ul className="list-reset absolute bg-white shadow-lg w-full">
      {props.suggestions.map((suggestion) => (
        <li
          onClick={(e) => props.handleSelect(suggestion)}
          key={suggestion.place_id}
          className="py-2 cursor-pointer border-b-2 border-gray-400 border-solid"
        >
          {suggestion.description}
        </li>
      ))}
    </ul>
  ) : null;
}

function isNotPassedDate(date: string) {
  return new Date(date) > new Date();
}

function setInvalidClass(state: defaultInputState) {
  return !state.isValid && state.isTouched
    ? "focus:border-red-500 border-red-500"
    : "";
}

function isLongEnough(value: string) {
  return value.length > 4;
}

export default Add;
