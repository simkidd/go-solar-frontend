export const formatDate = (date: number | Date | string) => {
  return new Date(date).toLocaleDateString("en-US", {
    timeZone: "UTC",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const slugify = (text: string) => {
  return text
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
};

export const formatCurrency = (value: number, currency: string) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    maximumFractionDigits: 0,
    currency,
  }).format(value);
};

export const formatDateTime = (isoString: number | Date | string) => {
  const date = new Date(isoString);
  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
};

export const getProductCodeFromSlug = (slug: string) => {
  const match = slug.match(/-(\d+)$/);
  return match ? match[1] : null;
};
