'use client'

import Loading from "@/components/Loading";
import { useEffect, useState } from "react";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

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
            .filter((w: any) => w.length > 1 && /^[a-z-]+$/.test(w));

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
        if (!loading && keywordsArray.length && typeof window !== 'undefined') {
            const script = document.createElement('script');
            script.src = '/wordcloud2.js';
            script.async = true;
            script.onload = () => {
                const canvas = document.getElementById('my_canvas') as HTMLCanvasElement;

                const drawCloud = () => {
                    if (!canvas || !window.WordCloud) return;

                    const dpr = window.devicePixelRatio || 1;
                    canvas.width = canvas.offsetWidth * dpr;
                    canvas.height = canvas.offsetHeight * dpr;

                    const ctx = canvas.getContext('2d');
                    if (ctx) ctx.scale(dpr, dpr);

                    window.WordCloud(canvas, {
                        list: keywordsArray,
                        gridSize: 10,
                        weightFactor: (size: number) => size * 20,
                        fontFamily: 'Helvetica, Arial, sans-serif',
                        // color: brandInfo?.wordcloudColor,
                        // color: 'random-light',
                        color: 'random-dark',
                        // backgroundColor: brandInfo?.mainColor,
                        backgroundColor: '#f7f7f7',
                        rotateRatio: 0.4,
                        rotationSteps: 2,
                        drawOutOfBound: false,
                        shrinkToFit: true,
                        origin: [canvas.offsetWidth / 2, canvas.offsetHeight / 2],
                        // shape: 'triangle-forward'
                    });
                };

                drawCloud();

                const resizeObserver = new ResizeObserver(() => {
                    drawCloud();
                });
                resizeObserver.observe(canvas);

                // Clean up
                return () => resizeObserver.disconnect();
            };

            document.body.appendChild(script);
        }
        if (!keywordsArray.length) {
            setNoResults(true)
        }
    }, [loading, keywordsArray]);


    return (
        <main className="flex w-full h-full items-center justify-center" style={{
            minHeight: '100vh'
        }}>
            {loading ? (<Loading />) : noResults ? (
                <div>

                    <DotLottieReact
                        src="https://lottie.host/08864e37-bfe9-40d9-8723-e94753d5c1f2/BDUSHwzIrM.lottie"
                        loop
                        autoplay
                        className=''
                    />
                    <p className="text-center">No data available at the moment. Please try again later.
                    </p>
                </div>
            ) : (
                <canvas id="my_canvas" style={{ width: '100vw', height: '100vh' }}></canvas>
            )}

        </main >
    );
}
