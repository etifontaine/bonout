import { string } from "fp-ts";
import React, { useState, useEffect } from "react";
import usePlacesAutocomplete from "use-places-autocomplete";

type suggestion = { place_id: string; location: string };
type suggestionsProps = {
  suggestions: Array<suggestion>;
  onSelect: (suggestion: suggestion) => void;
};

export function LocationSuggestions(props: suggestionsProps) {
  return props.suggestions.length > 0 ? (
    <ul className="suggestions bg-white border border-gray-300 w-full -mt-10">
      {props.suggestions.map((suggestion) => (
        <li
          onClick={(e) => props.onSelect(suggestion)}
          key={suggestion.place_id}
          className="pl-2 pr-2 py-1 bg-white text-left border-b-2 border-gray-100 relative cursor-pointer hover:bg-yellow-600 hover:text-gray-900"
        >
          {suggestion.location}
        </li>
      ))}
    </ul>
  ) : null;
}
export default LocationSuggestions;

export function withGooglePlacesAutocomplete(
  Component: React.FC<{
    suggestions: Array<suggestion>;
    onSelect: (suggestion: suggestion) => void;
  }>
) {
  return function WithGooglePlacesAutocomplete(props: {
    onSelect: CallableFunction;
    inputValue: string;
    debounceTime?: number;
  }) {
    const {
      setValue,
      clearSuggestions,
      suggestions: { data },
    } = usePlacesAutocomplete({
      debounce: props.debounceTime || 300,
      requestOptions: {
        // location: { lat: () => 37.7749, lng: () => -122.4194 },
      },
    });

    useEffect(() => {
      if (props.inputValue.length > 0) {
        setValue(props.inputValue);
      }
    }, [props, setValue]);

    return <Component suggestions={getSuggestions(data)} onSelect={onSelect} />;

    function onSelect(suggestion: suggestion) {
      props.onSelect(suggestion);
      clearSuggestions();
    }
    function getSuggestions(
      data: google.maps.places.AutocompletePrediction[]
    ): Array<suggestion> {
      return data.map((suggestion) => ({
        place_id: suggestion.place_id,
        location: suggestion.description,
      }));
    }
  };
}
