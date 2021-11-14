// react component for a text input

export interface InputProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  type?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  helperText?: string;
  onKeyDown?: (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => void;
}

export default function Input(props: InputProps) {
  const {
    id,
    value,
    label,
    onChange,
    placeholder,
    type = "text",
    className,
    disabled,
    onKeyDown,
    required,
    helperText,
  } = props;

  return (
    <div className="w-full md:w-1/2 mb-6 md:mb-0">
      <Label txt={label} helperText={helperText} />
      <input
        id={id}
        className={`appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 ${className}`}
        value={value}
        onChange={event => onChange(event.target.value)} // onChange is a function that takes an event
        placeholder={placeholder}
        type={type}
        disabled={disabled}
        onKeyDown={onKeyDown}
        required={required}
      />
    </div>
  );
}

function Label(props: {
  txt?: string;
  helperText?: string;
}) {
  return props.txt ? (
    <label
      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
      htmlFor="grid-first-name"
    >
      {props.txt}
      {props.helperText ? (
        <div className="text-red-500">
          {props.helperText}
        </div>
      ) : null}
    </label>
  ) : null;
}
