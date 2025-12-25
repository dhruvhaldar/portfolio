/**
 * Formats a date string into a more readable format, optionally including a relative time string.
 *
 * @param date - The date string to format (e.g., "2023-01-01").
 * @param includeRelative - Whether to include a relative time string (e.g., "(1y ago)"). Defaults to false.
 * @returns The formatted date string.
 */
export function formatDate(date: string, includeRelative = false) {
    const currentDate = new Date();
    if (!date.includes("T")) {
        date = `${date}T00:00:00`;
    }
    const targetDate = new Date(date);

    const diffMs = currentDate.getTime() - targetDate.getTime();
    const daysDiff = Math.floor(Math.abs(diffMs) / (1000 * 60 * 60 * 24));

    let formattedDate = "";

    if (diffMs < 0) {
        if (daysDiff === 0) {
            formattedDate = "Today";
        } else if (daysDiff >= 365) {
            formattedDate = `in ${Math.floor(daysDiff / 365)}y`;
        } else if (daysDiff >= 30) {
            formattedDate = `in ${Math.floor(daysDiff / 30)}mo`;
        } else {
            formattedDate = `in ${daysDiff}d`;
        }
    } else {
        if (daysDiff === 0) {
            formattedDate = "Today";
        } else if (daysDiff >= 365) {
            formattedDate = `${Math.floor(daysDiff / 365)}y ago`;
        } else if (daysDiff >= 30) {
            formattedDate = `${Math.floor(daysDiff / 30)}mo ago`;
        } else {
            formattedDate = `${daysDiff}d ago`;
        }
    }

    const fullDate = targetDate.toLocaleString("en-us", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });

    if (!includeRelative) {
        return fullDate;
    }

    return `${fullDate} (${formattedDate})`;
}
