export interface CitationAuthor {
    name: string;
}

export function formatAuthors(authors: CitationAuthor[] = []): string {
    if (!authors || authors.length === 0) return "";

    const formattedAuthors = authors.map((author: CitationAuthor) => {
        const parts = author.name.trim().split(" ");
        if (parts.length === 1) return parts[0];
        const lastName = parts[parts.length - 1];
        const initials = parts.slice(0, -1).map(p => p[0] + ".").join(" ");
        return `${lastName}, ${initials}`;
    });

    const formatList = (list: string[]) => {
        const last = list[list.length - 1];
        if (last.endsWith(".")) {
            list[list.length - 1] = last.slice(0, -1);
        }
        return list;
    };

    if (formattedAuthors.length === 1) return formattedAuthors[0] + ".";
    if (formattedAuthors.length === 2) {
        const [author1, author2] = formatList([...formattedAuthors]);
        return `${author1}, & ${author2}.`;
    }

    const lastAuthor = formattedAuthors.pop();
    const processedAuthors = formatList([...formattedAuthors, lastAuthor!]);
    const finalLastAuthor = processedAuthors.pop();
    return `${processedAuthors.join(", ")}, & ${finalLastAuthor}.`;
}

export function formatYear(date: string): string {
    if (!date) return "";
    return new Date(date).getFullYear().toString();
}
