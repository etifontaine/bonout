import React, { useContext, useState } from "react";
import Script from "next/script";
import Input from "../../Input";
import type { TdefaultInputState, Tform, TinputsStaticProps } from "./types";
import { pipe } from "fp-ts/lib/function";
import { getDateTime, add1h, add10min } from "./utils";
import useOnclickOutside from "react-cool-onclickoutside";
import {
  LocationSuggestions,
  withGooglePlacesAutocomplete,
} from "./LocationSuggestions";
import { ManagedUI } from "@src/context/UIContext";

import type { suggestion } from "./LocationSuggestions";
import { BoEvent } from "src/types";

const GMapsLocationSuggestions =
  withGooglePlacesAutocomplete(LocationSuggestions);

const defaultInputState: TdefaultInputState = {
  value: "",
  isValid: false,
  helperText: "",
  isTouched: false,
};

export function Form(props: {
  onSubmit: (
    e: React.FormEvent<HTMLFormElement>,
    form: Tform,
    isValid: boolean
  ) => void;
  event?: BoEvent;
}) {
  const { user } = useContext(ManagedUI);
  const [form, setForm] = useState(
    props.event
      ? {
          userName: {
            ...defaultInputState,
            value: props.event.user.name || "",
            isValid: true,
          },
          name: {
            ...defaultInputState,
            value: props.event.title,
            isValid: true,
          },
          description: {
            ...defaultInputState,
            value: props.event.description,
            isValid: true,
          },
          location: {
            ...defaultInputState,
            hideSuggestions: false,
            value: props.event.address,
            isValid: true,
          },
          startAt: {
            ...defaultInputState,
            value: getDateTime(new Date(props.event.start_at)),
            isValid: true,
          },
          endAt: {
            ...defaultInputState,
            value: getDateTime(new Date(props.event.end_at)),
            isValid: true,
          },
        }
      : ({
          userName: {
            ...defaultInputState,
            value: user ? user.name : "",
            isValid: user ? true : false,
          },
          name: defaultInputState,
          description: defaultInputState,
          location: {
            ...defaultInputState,
            hideSuggestions: false,
            isValid: true,
          },
          startAt: {
            ...defaultInputState,
            value: getDateTime(add10min(new Date())),
            isValid: true,
          },
          endAt: {
            ...defaultInputState,
            value: getDateTime(add1h(add10min(new Date()))),
            isValid: true,
          },
        } as Tform)
  );

  const [gmapIsLoad, setGmapIsLoad] = useState(true);

  const isFormValid = Object.values(form).every((input) => input.isValid);

  const locationFieldsetRef = useOnclickOutside(() => {
    setForm({ ...form, location: { ...form.location, hideSuggestions: true } });
  });

  return (
    <>
      <Script
        onLoad={() => setGmapIsLoad(true)}
        defer
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_MAPS_KEY}&libraries=places`}
      ></Script>
      <form
        onSubmit={(e) => {
          checkUp();
          props.onSubmit(e, form, isFormValid);
        }}
        className="pt-3"
      >
        <div className="flex flex-wrap">
          <div className="w-full mb-2">
            {generateInputs(inputsStaticProps())}
          </div>
        </div>
        <input
          value={props.event ? "Modifier" : "Créer"}
          type="submit"
          className={`${isFormValid ? "" : "cursor-not-allowed opacity-30"}
        btn bg-black cursor-pointer
        text-white font-bold py-2 px-4 float-right`}
        />
      </form>
    </>
  );

  function generateInputs(inputsProps: TinputsStaticProps[]) {
    return inputsProps.map((props) => {
      return (
        <div
          ref={props.id === "location" ? locationFieldsetRef : null}
          key={props.id}
          className="w-full mb-2"
        >
          <Input
            {...props}
            // required
            onFocus={onFocusHandler(props.id)}
            onChange={onChangeHandler(props.id, form)}
            value={form[props.id].value}
            helperText={form[props.id].helperText}
            className={setInvalidClass(form[props.id])}
          />
          {props.id === "location" &&
          !form.location.hideSuggestions &&
          gmapIsLoad &&
          form.location.isTouched ? (
            <GMapsLocationSuggestions
              onSelect={onSuggestionSelectHandler}
              inputValue={form.location.value}
            />
          ) : null}
        </div>
      );
    });
  }

  function onFocusHandler(id: string) {
    return () => {
      if (id === "location") {
        setForm({ ...form, [id]: { ...form[id], hideSuggestions: false } });
      }
    };
  }

  function onSuggestionSelectHandler(suggestion: suggestion) {
    setForm({
      ...form,
      location: {
        ...form.location,
        value: suggestion.location,
        isValid: true,
        hideSuggestions: true,
        helperText: "",
      },
    });
  }

  function onChangeHandler(inputId: string, form: Tform) {
    return (value: string) => {
      const newForm = pipe(
        form,
        setProp("value", value),
        setProp("isTouched", true),
        isInput("userName", (f) =>
          pipe(
            setProp("isValid", isLongEnough(2, value))(f),
            setHelperText(`Ce champ requiert au moins 2 caractères`)
          )
        ),
        isInput("name", (f) =>
          pipe(
            setProp("isValid", isLongEnough(3, value))(f),
            setHelperText(`Ce champ requiert au moins 3 caractères`)
          )
        ),
        isInput("description", (f) =>
          pipe(
            setProp("isValid", isLongEnough(5, value))(f),
            setHelperText(`Ce champ requiert au moins 5 caractères`)
          )
        ),
        isInput("startAt", (f) =>
          pipe(
            setProp(
              "value",
              isNotPassedDate(value, f.endAt.value)
                ? getDateTime(add1h(new Date(value)))
                : f.endAt.value,
              "endAt"
            )(f),
            setProp("isValid", isNotPassedDate(value)),
            setHelperText(
              "La date de l'événement ne peut pas être dans le passé"
            )
          )
        ),
        isInput("endAt", (f) =>
          pipe(
            setProp("isValid", isNotPassedDate(value, f.startAt.value))(f),
            setHelperText(
              "La date de l'événement doit être supérieur à la date de début"
            )
          )
        )
        // isInput("location", (f) =>
        //   pipe(
        //     setProp("isValid", false)(f),
        //     setHelperText(
        //       `Le lieu ${f.location.value} semble incorrect, veuillez utiliser les suggestions`
        //     )
        //   )
        // )
      );
      setForm(newForm);
      return newForm;
    };

    function isInput(inputName: string, editedForm: (f: Tform) => Tform) {
      return (form: Tform) => {
        if (inputId !== inputName) return form;
        return editedForm(form);
      };
    }

    function setProp(prop: string, value: string | boolean, id = inputId) {
      return (form: Tform): Tform => ({
        ...form,
        [id]: {
          ...form[id],
          [prop]: value,
        } as TdefaultInputState,
      });
    }

    function setHelperText(helperText: string) {
      return (form: Tform): Tform =>
        setProp("helperText", form[inputId].isValid ? "" : helperText)(form);
    }

    function isLongEnough(nth: number, value: string) {
      return value.length >= nth;
    }

    function isNotPassedDate(date: string, to?: string) {
      return new Date(date) > (to ? new Date(to) : new Date());
    }
  }

  function checkUp() {
    if (isFormValid) return;
    Object.entries(form)
      .filter(([id, data]) => !(id === "location" && data.isValid))
      .reduce((f, [id, data]) => {
        return onChangeHandler(id, f)(data.value);
      }, form);
  }
  function setInvalidClass(state: TdefaultInputState) {
    return !state.isValid && state.isTouched
      ? "focus:border-red-500 border-red-500 invalid"
      : "valid";
  }
}

export function inputsStaticProps(): TinputsStaticProps[] {
  return [
    {
      id: "userName",
      placeholder: "Nom ou pseudo",
      label: "Nom",
    },
    {
      id: "name",
      placeholder: "Nom de l'événement",
      label: "Nom de l'événement",
    },
    {
      id: "description",
      type: "textarea",
      placeholder: "Description de l'événement",
      label: "Et quelques infos ?",
    },
    {
      id: "startAt",
      type: "datetime-local",
      label: "On commence quand ?",
    },
    {
      id: "endAt",
      type: "datetime-local",
      label: "Jusqu'à quand ?",
    },
    {
      id: "location",
      placeholder: "Lieu de l'événement",
      label: "Un lieu ?",
    },
  ];
}
