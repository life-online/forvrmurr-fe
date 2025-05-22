import data from "../data/notes.json";
export const findNotesImageLocally = (note: string) => {
  const image = data.find((item) => item.note === note)?.image;
  if (image) {
    return image;
  }
  return "/images/scent_notes/honey.png";
};
