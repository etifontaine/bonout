export const LENGTH_ERROR = (nb: number) =>
  `Ce champ requiert au moins ${nb} caractères`;

export const DATE_PASSED_ERROR = (date: string) =>
  `La date de l'événement doit être supérieur à ${date}`;

export const INVALID_PLACE_ERROR = (payload: string) =>
  `Le lieu ${payload} semble incorrect`;
