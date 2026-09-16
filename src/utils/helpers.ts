import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

/**
 * Formats a date value into a human-readable string.
 * @param date - Date, string, timestamp, or null/undefined
 * @param format - dayjs format string (default: "MMMM D, YYYY")
 * @returns Formatted date string, or "-" if empty/invalid
 */
export const formatDate = (
  date?: number | Date | string | null,
  format: string = "MMMM D, YYYY",
) => {
  if (!date) return "-";
  const parsed = dayjs(date);
  return parsed.isValid() ? parsed.format(format) : "-";
};

/**
 * Formats a date strictly into numeric digits (e.g., "16/09/2026" or "2026-09-16").
 * @param date - Date, string, timestamp, or null/undefined
 * @param format - dayjs format string (default: "DD/MM/YYYY")
 * @returns Formatted numeric date string, or "-" if empty/invalid
 */
export const formatNumericDate = (
  date?: number | Date | string | null,
  format: string = "DD/MM/YYYY",
) => {
  if (!date) return "-";
  const parsed = dayjs(date);
  return parsed.isValid() ? parsed.format(format) : "-";
};

/**
 * Formats a date with time included (e.g., "September 16, 2026, 03:30 PM").
 * @param date - Date, string, timestamp, or null/undefined
 * @param format - dayjs format string (default: "MMMM D, YYYY, hh:mm A")
 * @returns Formatted date-time string, or "-" if empty/invalid
 */
export const formatDateTime = (
  date?: number | Date | string | null,
  format: string = "MMMM D, YYYY, hh:mm A",
) => {
  if (!date) return "-";
  const parsed = dayjs(date);
  return parsed.isValid() ? parsed.format(format) : "-";
};

/**
 * Formats a relative time string (e.g., "2 hours ago", "in 3 days").
 * @param date - Date, string, timestamp, or null/undefined
 * @returns Relative time string, or "-" if empty/invalid
 */
export const formatRelativeTime = (date?: number | Date | string | null) => {
  if (!date) return "-";
  const parsed = dayjs(date);
  return parsed.isValid() ? parsed.fromNow() : "-";
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

export const getProductCodeFromSlug = (slug: string) => {
  const match = slug.match(/-(\d+)$/);
  return match ? match[1] : null;
};
