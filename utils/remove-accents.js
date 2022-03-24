export const removeAccents = (word) => {
  return word
    .toLowerCase()
    .replace(/ľ/g, "l")
    .replace(/š/g, "s")
    .replace(/č/g, "c")
    .replace(/ť/g, "t")
    .replace(/ž/g, "z")
    .replace(/ď/g, "d")
    .replace(/ň/g, "n")
    .replace(/ĺ/g, "l")
    .replace(/ŕ/g, "r")
    .replace(/ý/g, "y")
    .replace(/á/g, "a")
    .replace(/í/g, "i")
    .replace(/é/g, "e")
    .replace(/ó/g, "o")
    .replace(/ú/g, "u");
};
