/**
 * Returns the current date in the format "YYYY-MM-DD".
 *
 * @returns A string representing the current date.
 */
export const getCurrentDateFormatted = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  return `${year}-${month}-${day}`;
};

/**
 * Returns the current time in the Philippines (PHT)
 * in the format "H:MM AM/PM".
 *
 * @returns A string representing the current Philippine time.
 */
export const getCurrentPhilippineTime = (): string => {
  const now = new Date();

  const formatter = new Intl.DateTimeFormat("en-US", {
    hour: "numeric", // e.g., "1", "12"
    minute: "2-digit", // e.g., "05", "30"
    hour12: true, // Use AM/PM
    timeZone: "Asia/Manila", // Philippine timezone
  });

  return formatter.format(now);
};

/**
 * Returns the current time in the Philippines (PHT) with seconds
 * in the format "H:MM:SS AM/PM".
 *
 * @returns A string representing the current Philippine time with seconds.
 */
export const getCurrentPhilippineTimeWithSeconds = (): string => {
  const now = new Date();

  const formatter = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit", // Added seconds
    hour12: true,
    timeZone: "Asia/Manila", // Ensures PHT is always used
  });

  return formatter.format(now);
};
