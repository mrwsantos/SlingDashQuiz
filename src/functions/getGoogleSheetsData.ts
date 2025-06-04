import { google } from 'googleapis';

export async function getGoogleSheetsData(spreadsheetId: string, range: string, key: string) {
    const auth = new google.auth.GoogleAuth({
        keyFile: key,
        scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const res = await sheets.spreadsheets.values.get({
        spreadsheetId: spreadsheetId,
        range: range,
    });
    return res.data.values;
}

// export const getGoogleDataQuestions = async (sheetId: string) => {
//     const res = await fetch(`/api/sheets?spreadsheetId=${sheetId}&range=Input!B2:B1000`);

//     if (!res.ok) {
//         try {
//             const errorText = await res.text();
//             console.error('API ERROR:', res.status, errorText);
//         } catch (err) {
//             console.error('Failed to read error body:', err);
//         }
//         return;
//     }

//     try {
//         const data = await res.json();
//         return data
//     } catch (err) {
//         console.error('Failed to parse JSON:', err);
//     }
// };

export const getGoogleDataCompanyTitle = async (sheetId: string) => {
    const res = await fetch(`/api/sheets?spreadsheetId=${sheetId}&range=Input!A2`);

    if (!res.ok) {
        try {
            const errorText = await res.text();
            console.error('API ERROR:', res.status, errorText);
        } catch (err) {
            console.error('Failed to read error body:', err);
        }
        return;
    }

    try {
        const data = await res.json();
        return data
    } catch (err) {
        console.error('Failed to parse JSON:', err);
    }
};