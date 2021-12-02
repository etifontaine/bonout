import type {
  ChangeEventHandler,
  FocusEventHandler,
  InputHTMLAttributes,
} from "react";

// react component for a text input
export interface InputProps
  extends Omit<SuperInputProps, "onChange" | "onFocus"> {
  label?: string;
  helperText?: string;
  onChange: (value: string, id: string) => void;
  onFocus: (value: string, id: string) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

export interface SuperInputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onFocus: FocusEventHandler<HTMLInputElement>;
}

export default function Input(props: InputProps) {
  const {
    id,
    value,
    label,
    onChange,
    onFocus,
    placeholder,
    type = "text",
    className,
    disabled,
    onKeyDown,
    required,
    helperText,
  } = props;

  return (
    <div className="w-full mb-6 md:mb-0">
      <Label inputId={id} txt={label} />
      <SuperInput
        id={id}
        className={`appearance-none block w-full text-gray-700 border border-black py-3 px-4 leading-tight focus:outline-none ${className}`}
        value={value}
        onChange={(event) => onChange(event.target.value, id)} // onChange is a function that takes an event
        onFocus={(event) => onFocus(event.target.value, id)} // onChange is a function that takes an event
        placeholder={placeholder}
        type={type}
        disabled={disabled}
        onKeyDown={onKeyDown}
        required={required}
        autoComplete="off"
      />
      <Label inputId={id} txt={helperText} isHelp={helperText ? true : false} />
    </div>
  );
}

function SuperInput(props: SuperInputProps) {
  const cleanProps = Object.entries(props).reduce((acc, [key, value]) => {
    if (value === undefined) return acc;
    return { ...acc, [key]: value };
  }, {});

  return props.type === "textarea" ? (
    <textarea {...cleanProps} />
  ) : (
    <input {...cleanProps} />
  );
}

function Label(props: { inputId: string; txt?: string; isHelp?: boolean }) {
  return props.txt ? (
    <label
      className={`${
        props.isHelp
          ? "text-red-500 text-xs help-label"
          : "text-gray-700 text-s font-bold"
      } block text-left tracking-wide`}
      htmlFor={props.inputId}
    >
      {props.txt}
    </label>
  ) : null;
}
