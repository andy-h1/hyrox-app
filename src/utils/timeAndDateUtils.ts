export const formatDate = (date: Date): string => {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const day = date.getDate();
  const year = date.getFullYear();
  const month = months[date.getMonth()];

  const hour = date.getHours();
  const hourAmPM = hour >= 12 ? 'pm' : 'am';
  const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
  const minute = date.getMinutes().toString().padStart(2, '0');

  return `${month} ${day}, ${year} at ${formattedHour}:${minute} ${hourAmPM}`;
};

export const convertSecondsToMins = (totalSeconds: number) => {
  const mins = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${mins}mins ${seconds}secs`;
};
