import { google } from 'googleapis';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const spreadsheetId = searchParams.get('spreadsheetId');
    const range = searchParams.get('range');

    if (!spreadsheetId || !range) {
        console.error('❌ Missing spreadsheetId or range');
        return new Response(JSON.stringify({ error: 'Missing spreadsheetId or range' }), { status: 400 });
    }

    try {
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_EMAIL,
                private_key: process.env.NEXT_PUBLIC_GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
        });

        const sheets = google.sheets({ version: 'v4', auth });
        const response = await sheets.spreadsheets.values.get({ spreadsheetId, range });

        console.log('✅ Sheets API response:', response.data);

        // Certifique-se de sempre retornar JSON válido
        return new Response(JSON.stringify(response.data.values || []), { status: 200 });
    } catch (error: any) {
        console.error('❌ Google Sheets API error:', error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
