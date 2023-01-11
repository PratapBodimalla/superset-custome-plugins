import { AddWhenType } from "./types";

export const addWhen = ({
  data,
  add = false,
  arrayParse = true,
}: AddWhenType) => {
  if (!add) {
    return arrayParse ? [] : {};
  }

  return arrayParse && !Array.isArray(data) ? [data] : data;
};

export const capitalize = (word: string) =>
  word ? word.charAt(0).toUpperCase() + word.slice(1) : "";
