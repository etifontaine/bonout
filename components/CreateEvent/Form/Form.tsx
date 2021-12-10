import React, { useState } from "react";
import { useTranslation } from "next-i18next";
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

import type { suggestion } from "./LocationSuggestions";
import { BoEvent } from "src/types";
import { getUserName } from "@src/utils/user";
import { isClientSide } from "@src/utils/client";

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
  const { t } = useTranslation(["events", "errors"]);
  const [form, setForm] = useState(
    props.event
      ? {
        userName: {
          ...defaultInputState,
          value: props.event.user_name || "",
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
          value: getUserName() || "",
          isValid: getUserName() ? true : false,
        },
        name: defaultInputState,
        description: defaultInputState,
        location: { ...defaultInputState, hideSuggestions: false },
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

  const [gmapIsLoad, setGmapIsLoad] = useState(false);
  if (isClientSide()) {
    if (window.google && !gmapIsLoad) {
      setGmapIsLoad(true);
    }
  }

  const isFormValid = Object.values(form).every((input) => input.isValid);

  const locationFieldsetRef = useOnclickOutside(() => {
    setForm({ ...form, location: { ...form.location, hideSuggestions: true } });
  });

  return (
    <>
      <Script
        onLoad={() => setGmapIsLoad(true)}
        defer
        src={`https://maps.googleapis.com/maps/api/js?key=AIzaSyAugCWPRmET1IH1TkplqNzrGMgK1yItKmM&libraries=places`}
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
          value={
            props.event
              ? t<string>("common.update")
              : t<string>("common.create")
          }
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
            setHelperText(t("LENGTH_ERROR", { nb: 2, ns: "errors" }))
          )
        ),
        isInput("name", (f) =>
          pipe(
            setProp("isValid", isLongEnough(3, value))(f),
            setHelperText(t("LENGTH_ERROR", { nb: 3, ns: "errors" }))
          )
        ),
        isInput("description", (f) =>
          pipe(
            setProp("isValid", isLongEnough(5, value))(f),
            setHelperText(t("LENGTH_ERROR", { nb: 5, ns: "errors" }))
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
            setHelperText(t("DATE_PASSED_ERROR_FUTURE", { ns: "errors" }))
          )
        ),
        isInput("endAt", (f) =>
          pipe(
            setProp("isValid", isNotPassedDate(value, f.startAt.value))(f),
            setHelperText(t("DATE_PASSED_ERROR", { ns: "errors" }))
          )
        ),
        isInput("location", (f) =>
          pipe(
            setProp("isValid", false)(f),
            setHelperText(
              t("INVALID_PLACE_ERROR", {
                payload: f.location.value,
                ns: "errors",
              })
            )
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
      id: "userName",
    },
    {
      id: "name",
    },
    {
      id: "description",
      type: "textarea",
    },
    {
      id: "startAt",
      type: "datetime-local",
    },
    {
      id: "endAt",
      type: "datetime-local",
    },
    {
      id: "location",
    },
  ];
}
