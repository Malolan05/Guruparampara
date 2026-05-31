export const textFor = (field, lang) => field?.[lang] || field?.en || "";

export const resolveImagePath = (image) => {
  if (!image) return "";
  if (/^https?:\/\//.test(image)) return image;
  if (image.startsWith("/images/")) return image;
  if (image.startsWith("acharya-image/")) {
    return `/images/${image.replace("acharya-image/", "")}`;
  }
  return `/images/${image}`;
};
