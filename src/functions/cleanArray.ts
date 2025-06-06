export default function clearArrayEntries(rawData: object[]) {
    const cleaned = rawData.map(([entry]: any) => {
        const [name, question] = entry.split(';').map((s: string) => s.trim().replace(/\n/g, ' '));
        return { name, question };
    });
    return cleaned;
}