export const getCurrentDateFormatted = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  return `${year}-${month}-${day}`;
};

export type TimeLogType = "IN" | "OUT";

export const getRandomizedTime = (logType: TimeLogType): string => {
  let hour: number;
  let minute: number;
  let ampm: string;

  if (logType === "IN") {
    const randomMinutesInWindow = Math.floor(Math.random() * 6);
    if (randomMinutesInWindow === 5) {
      hour = 8;
      minute = 0;
    } else {
      hour = 7;
      minute = 55 + randomMinutesInWindow;
    }
    ampm = "AM";
  } else {
    hour = 5;
    minute = Math.floor(Math.random() * 11);
    ampm = "PM";
  }

  const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
  const formattedMinute = minute < 10 ? `0${minute}` : minute.toString();
  return `${formattedHour}:${formattedMinute} ${ampm}`;
};
