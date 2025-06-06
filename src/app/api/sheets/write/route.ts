import { google } from 'googleapis';
import { NextRequest } from 'next/server';
import path from 'path';

export async function PATCH(req: NextRequest) {
    const { spreadsheetId, range, values } = await req.json();

    if (!spreadsheetId || !range || !values) {
        return new Response(JSON.stringify({ error: 'Missing spreadsheetId, range or values' }), { status: 400 });
    }

    try {
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_EMAIL,
                private_key: process.env.NEXT_PUBLIC_GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const sheets = google.sheets({ version: 'v4', auth });

        const result = await sheets.spreadsheets.values.append({
            spreadsheetId,
            range, // Ex: 'Output!A1:B1' (apenas define onde começar a estrutura das colunas)
            valueInputOption: 'RAW', // ou 'USER_ENTERED'
            insertDataOption: 'INSERT_ROWS',
            requestBody: {
                values, // precisa ser array de arrays
            },
        });

        // console.log('✅ Dados adicionados com sucesso:', result.data);

        return new Response(JSON.stringify({ success: true, updates: result.data.updates }), { status: 200 });
    } catch (error: any) {
        console.error('❌ Erro ao adicionar no Sheets:', error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
