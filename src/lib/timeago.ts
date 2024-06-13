export default function timeSince(date: string): string {
  const postDate = new Date(date);
  const now = new Date();
  const diffInMs = now.getTime() - postDate.getTime();

  const seconds = Math.floor(diffInMs / 1000);

  if (seconds < 60) {
    return `${seconds}s`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m`;
  } else {
    const hours = Math.floor(seconds / 3600);
    if (hours < 24) {
      return `${hours}h`;
    } else {
      const days = Math.floor(hours / 24);
      return `${days}d`;
    }
  }
}
