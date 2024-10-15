export default function timeSince(input: Date | string): string {
  const date = input instanceof Date ? input : new Date(input);
  const nowUTC = new Date();
  const timezoneOffsetMillis = nowUTC.getTimezoneOffset() * 60 * 1000;
  const now = new Date(nowUTC.getTime() - timezoneOffsetMillis);
  const secondsElapsed = Math.round((now.getTime() - date.getTime()) / 1000);

  const ranges: Record<string, number> = {
    year: 3600 * 24 * 365,
    month: 3600 * 24 * 30,
    week: 3600 * 24 * 7,
    day: 3600 * 24,
    hour: 3600,
    minute: 60,
    second: 1
  };

  for (const [key, value] of Object.entries(ranges)) {
    if (Math.abs(secondsElapsed) >= value) {
      const delta = Math.floor(Math.abs(secondsElapsed) / value);
      const unit = delta === 1 ? key : key + "s";
      return `${delta} ${unit} ago`;
    }
  }

  return "just now";
}
