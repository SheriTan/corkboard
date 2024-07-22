export default function datetimeConverter(datetime) {
    const now = new Date();
    const createdDt = new Date(datetime);
    const difference = now - createdDt;

    const seconds = Math.floor(difference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) {
        return seconds < 10 ? "just now" : `${seconds} seconds ago`;
    } else if (minutes < 60) {
        return `${minutes} min ago`;
    } else if (hours < 24) {
        return `${hours} hr ago`;
    } else if (days < 2) {
        return "a day ago";
    } else {
        return `${days} days ago`;
    }
}