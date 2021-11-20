import React, { useState } from "react";
import Input from "../../Input";
import type { TdefaultInputState, Tform, TinputsStaticProps } from "./types";
import { DATE_PASSED_ERROR, LENGTH_ERROR } from "./errors.text";
import { pipe } from "fp-ts/lib/function";
import { getDateTime, add1h } from "./utils";
import {
  LocationSuggestions,
  withGooglePlacesAutocomplete,
} from "./LocationSuggestions";
const GMapsLocationSuggestions =
  withGooglePlacesAutocomplete(LocationSuggestions);
const defaultInputState: TdefaultInputState = {
  value: "",
  isValid: false,
  helperText: "",
  isTouched: false,
};

export function Form() {
  const [form, setForm] = useState({
    name: defaultInputState,
    description: defaultInputState,
    location: defaultInputState,
    startAt: { ...defaultInputState, value: getDateTime(new Date()) },
    endAt: { ...defaultInputState, value: getDateTime(add1h(new Date())) },
  } as Tform);

  return <form>{generateInputs(inputsStaticProps())}</form>;

  function generateInputs(inputsProps: TinputsStaticProps[]) {
    return inputsProps.map((props) => {
      return (
        <div key={props.id} className="w-full mb-2">
          <Input
            {...props}
            onChange={onChangeHandler(props.id)}
            value={form[props.id].value}
            helperText={form[props.id].helperText}
            className={setInvalidClass(form[props.id])}
          />
          {props.id === "location" && (
            <GMapsLocationSuggestions
              onSelect={onSelectHandler}
              inputValue={form.location.value}
            />
          )}
        </div>
      );
    });
  }

  function onSelectHandler(value: string) {
    setForm({
      ...form,
      location: { ...form.location, value, isValid: true },
    });
  }

  function onChangeHandler(inputId: string) {
    return (value: string) => {
      pipe(
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
        setForm
      );
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
      required: true,
    },
    {
      id: "description",
      label: "Et quelque infos ?",
      placeholder: "Description de l'événement",
      required: true,
      type: "textarea",
    },
    {
      id: "startAt",
      label: "On commence quand ?",
      type: "datetime-local",
      required: true,
    },
    {
      id: "endAt",
      label: "Jusqu'à quand ?",
      type: "datetime-local",
      required: true,
    },
    {
      id: "location",
      label: "Un lieu ?",
      placeholder: "Lieu de l'événement",
      required: true,
    },
  ];
}
