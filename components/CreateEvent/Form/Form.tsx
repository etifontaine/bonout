import React, { useState, useEffect } from "react";
import Input from "../../Input";
import type { TdefaultInputState, Tform, TinputsStaticProps } from "./types";
import { DATE_PASSED_ERROR, LENGTH_ERROR } from "./errors.text";
import { pipe } from "fp-ts/lib/function";
import { getDateTime, add1h } from "./utils";
import useOnclickOutside from "react-cool-onclickoutside";
import {
  LocationSuggestions,
  withGooglePlacesAutocomplete,
} from "./LocationSuggestions";

import type { suggestion } from "./LocationSuggestions";
import { cp } from "fs/promises";

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
}) {
  const [form, setForm] = useState({
    name: defaultInputState,
    description: defaultInputState,
    location: { ...defaultInputState, hideSuggestions: false },
    startAt: { ...defaultInputState, value: getDateTime(new Date()) },
    endAt: { ...defaultInputState, value: getDateTime(add1h(new Date())) },
  } as Tform);

  const isFormValid = Object.values(form).every((input) => input.isValid);

  const locationFieldsetRef = useOnclickOutside(() => {
    setForm({ ...form, location: { ...form.location, hideSuggestions: true } });
  });

  return (
    <form
      onSubmit={(e) => {
        checkUp();
        props.onSubmit(e, form, isFormValid);
      }}
      className="pt-3"
    >
      <div className="flex flex-wrap">
        <div className="w-full mb-2">{generateInputs(inputsStaticProps())}</div>
      </div>
      <input
        value="Créer"
        // disabled={!isFormValid}
        type="submit"
        className={`${isFormValid ? "" : "cursor-not-allowed opacity-30"}
        bg-yellow-600 hover:bg-yellow-700 btn cursor-pointer
        text-white font-bold py-2 px-4 float-right`}
      />
    </form>
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
          {props.id === "location" && !form.location.hideSuggestions ? (
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
        isInput("name", (f) =>
          pipe(
            setProp("isValid", isLongEnough(3, value))(f),
            setHelperText(LENGTH_ERROR(3))
          )
        ),
        isInput("description", (f) =>
          pipe(
            setProp("isValid", isLongEnough(5, value))(f),
            setHelperText(LENGTH_ERROR(5))
          )
        ),
        isInput("startAt", (f) =>
          pipe(
            setProp("isValid", isNotPassedDate(value))(f),
            setHelperText(DATE_PASSED_ERROR("aujourd'hui"))
          )
        ),
        isInput("endAt", (f) =>
          pipe(
            setProp("isValid", isNotPassedDate(value, f.startAt.value))(f),
            setHelperText(DATE_PASSED_ERROR("date de commencement"))
          )
        ),
        isInput("location", (f) =>
          pipe(
            setProp("isValid", false)(f),
            setHelperText(DATE_PASSED_ERROR("date de commencement"))
          )
        )
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

    function setProp(prop: string, value: string | boolean) {
      return (form: Tform): Tform => ({
        ...form,
        [inputId]: {
          ...form[inputId],
          [prop]: value,
        } as TdefaultInputState,
      });
    }

    function setHelperText(helperText: string) {
      return (form: Tform): Tform =>
        setProp("helperText", form[inputId].isValid ? "" : helperText)(form);
    }

    function isLongEnough(nth: Number, value: string) {
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
      id: "name",
      label: "Nom de l'événement",
      placeholder: "Nom de l'événement",
    },
    {
      id: "description",
      label: "Et quelque infos ?",
      placeholder: "Description de l'événement",
      type: "textarea",
    },
    {
      id: "startAt",
      label: "On commence quand ?",
      type: "datetime-local",
    },
    {
      id: "endAt",
      label: "Jusqu'à quand ?",
      type: "datetime-local",
    },
    {
      id: "location",
      label: "Un lieu ?",
      placeholder: "Lieu de l'événement",
    },
  ];
}
