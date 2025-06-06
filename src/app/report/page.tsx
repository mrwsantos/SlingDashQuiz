'use client'

import Loading from "@/components/Loading";
import { useEffect, useState } from "react";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import NoResults from "@/components/NoResults";

declare global {
    interface Window {
        WordCloud: any;
    }
}

export default function Page() {
    const [loading, setLoading] = useState(true);
    const [keywordsArray, setKeywordsArray] = useState<[string, number][]>([]);
    const commonTimeoutTime = 1500;
    const [noResults, setNoResults] = useState<boolean>(false)

    const [brandInfo, setBrandInfo] = useState<null | {
        companyTitle: string;
        mainColor: string;
        textColor: string;
        wordcloudColor: string;
        questions: object[];
        keywordsSheetsColumn: string
    }>(null);

    useEffect(() => {
        const fetchBrandInfo = async () => {
            const res = await fetch('brand-info.json');
            const data = await res.json();
            setBrandInfo(data);
        };
        fetchBrandInfo();
    }, []);


    const getGoogleData = async (sheetId: string) => {
        const res = await fetch(`/api/sheets?spreadsheetId=${sheetId}&range=Output!${brandInfo?.keywordsSheetsColumn}`);
        const data = await res.json();

        const cleaned = data
            .flat()
            .join(',')
            .split(',')
            .map((w: any) => w.trim().toLowerCase())
            // .filter((w: any) => w.length > 1 && /^[a-z-]+$/.test(w));
            .filter((w: any) => w.length > 1 && /^[a-z0-9-]+$/.test(w));

        const frequency: Record<string, number> = {};
        cleaned.forEach((word: any) => {
            frequency[word] = (frequency[word] || 0) + 1;
        });

        const list = Object.entries(frequency);
        setKeywordsArray(list);

        setTimeout(() => {
            setLoading(false);
        }, commonTimeoutTime)
    };

    useEffect(() => {
        const sheetsId: string = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_ID || '';
        if (brandInfo) getGoogleData(sheetsId);
    }, [brandInfo])


    useEffect(() => {
        if (!loading && !keywordsArray.length) setNoResults(true)

        if (!loading && keywordsArray.length && typeof window !== 'undefined') {
            const script = document.createElement('script');
            script.src = '/wordcloud2.js';
            script.async = true;

            let resizeObserver: ResizeObserver;

            const MIN_WORD_COUNT = 1; // ou vindo de input/config
            const MAX_KEYWORDS = 50;

            const filteredKeywords = keywordsArray.filter(([_, freq]) => freq >= MIN_WORD_COUNT).sort((a: any, b: any) => b[1] - a[1]).slice(0, MAX_KEYWORDS);
            // console.log('filterred: ', filteredKeywords)

            script.onload = () => {
                const canvas = document.getElementById('my_canvas');
                if (!canvas || !(canvas instanceof HTMLCanvasElement) || !window.WordCloud) return;

                const drawCloud = () => {
                    const dpr = window.devicePixelRatio || 1;
                    canvas.width = canvas.offsetWidth * dpr;
                    canvas.height = canvas.offsetHeight * dpr;

                    const ctx = canvas.getContext('2d');
                    if (ctx) ctx.scale(dpr, dpr);

                    window.WordCloud(canvas, {
                        list: filteredKeywords,
                        // gridSize: Math.max(12, Math.min(50, Math.floor(keywordsArray.length * 0.3))),
                        gridSize: MAX_KEYWORDS,
                        weightFactor: (size: number) => size * 30,
                        // weightFactor: (size: number) => Math.min(10, Math.max(1.05, size)) * 15,
                        fontFamily: 'Akatab, sans-serif',
                        color: 'random-dark',
                        backgroundColor: '#f7f7f7',
                        rotateRatio: 0,
                        rotationSteps: 2,
                        drawOutOfBound: false,
                        shrinkToFit: true,
                        minSize: 0,
                        origin: [canvas.offsetWidth / 2, canvas.offsetHeight / 2],
                        wait: 5,
                    });
                };

                drawCloud();

                resizeObserver = new ResizeObserver(() => {
                    drawCloud();
                });

                resizeObserver.observe(canvas);
            };

            document.body.appendChild(script);

            return () => {
                if (resizeObserver) resizeObserver.disconnect();
                document.body.removeChild(script);
            };
        }

        // if (!keywordsArray.length) {
        // }
    }, [loading, keywordsArray]);

    return (
        <main
            className="flex w-full h-full items-center justify-center bg-white"
            style={{ minHeight: '100vh' }}
        >
            {loading ? (
                <Loading />
            ) : noResults ? (
                <NoResults />
            ) : (
                <canvas
                    id="my_canvas"
                    style={{ width: '100vw', height: '100vh', display: 'block' }}
                ></canvas>
            )}
        </main>
    );

}
