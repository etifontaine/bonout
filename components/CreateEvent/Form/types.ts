export type TdefaultInputState = {
  value: string;
  isValid: boolean;
  helperText: string;
  isTouched: boolean;
  hideSuggestions?: boolean;
};

export type Tform = {
  [key: string]: TdefaultInputState;
  name: TdefaultInputState;
  description: TdefaultInputState;
  location: TdefaultInputState;
  startAt: TdefaultInputState;
  endAt: TdefaultInputState;
};

export type TinputsStaticProps = {
  id: string;
  label: string;
  placeholder?: string;
  required?: true;
  type?: string;
};
