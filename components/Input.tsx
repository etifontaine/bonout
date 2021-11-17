// react component for a text input

export interface InputProps {
  id: string;
  value: string;
  onChange: (value: string, id: string) => void;
  label?: string;
  placeholder?: string;
  type?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  helperText?: string;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
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
    <div className="w-full mb-6 md:mb-0">
      <Label txt={label} />
      <input
        id={id}
        className={`appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 ${className}`}
        value={value}
        onChange={(event) => onChange(event.target.value, id)} // onChange is a function that takes an event
        placeholder={placeholder}
        type={type}
        disabled={disabled}
        onKeyDown={onKeyDown}
        required={required}
      />
      <Label txt={helperText} isHelp={helperText? true : false} />
    </div>
  );
}

function Label(props: { txt?: string, isHelp?: boolean }) {
  return props.txt ? (
    <label
      className={`${props.isHelp ? 'text-red-500 text-xs' : 'text-gray-700 text-s font-bold'} block text-left tracking-wide`}
      htmlFor="grid-first-name"
    >
      {props.txt}
    </label>
  ) : null;
}
