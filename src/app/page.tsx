'use client'

import { useEffect, useState } from "react";


import Button from "@/components/Button";
import Input from "@/components/Input";
import Loading from "@/components/Loading";
import Footer from "@/components/Footer";
import Success from "@/components/Success";
import Fail from "@/components/Fail";
const keyword_extractor = require("keyword-extractor");

interface Question {
  name: string,
  question: string
}

export default function Home() {
  const [brandInfo, setBrandInfo] = useState<null | {
    companyTitle: string;
    mainColor: string;
    textColor: string;
    wordcloudColor: string;
    questions: Question[];
    keywordsSheetsColumn: string
  }>(null);



  const [mainLoading, setMainLoading] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [showFail, setShowFail] = useState<boolean>(false);

  const [step, setStep] = useState<number>(0);
  const [fade, setFade] = useState<'fade-in' | 'fade-out'>('fade-in');
  const [keyWords, setKeyWords] = useState<string[]>([])

  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<string[]>(Array(10).fill(''));

  const commonTimeoutTime = 1500;

  useEffect(() => {
    const fetchBrandInfo = async () => {
      const res = await fetch('brand-info.json');
      const data = await res.json();
      setBrandInfo(data);
    };
    fetchBrandInfo();
  }, []);

  useEffect(() => {
    if (brandInfo) {
      setQuestions(brandInfo.questions);

      if (brandInfo?.questions.length) {
        setTimeout(() => {
          setMainLoading(false)
        }, commonTimeoutTime)
      }
    }
  }, [brandInfo])


  const handleStepChange = (direction: 'next' | 'back') => {
    setFade('fade-out');
    setTimeout(() => {
      setStep(prev => direction === 'next' ? prev + 1 : prev - 1);
      setFade('fade-in');
    }, 300);
  };

  const handleAnswerChange = (value: string) => {
    setAnswers(prev => {
      const updated = [...prev];
      updated[step] = value;
      return updated;
    });
  };

  const getKeyWords = () => {
    const extraction_result =
      keyword_extractor.extract(answers.join(' '), {
        language: "english",
        remove_digits: true,
        return_changed_case: true,
        remove_duplicates: false
      });
    setKeyWords(extraction_result)
  }

  useEffect(() => {
    if (keyWords.length) writeOutputIntoFile()
  }, [keyWords])

  const writeOutputIntoFile = async () => {
    try {
      const cleanedKeywords = keyWords.map((word: string) =>
        word.replace(/[\[\]\(\)]/g, '')
      );

      const outputData = [...answers, cleanedKeywords.join(', ')];

      const res = await fetch('/api/sheets/write', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          spreadsheetId: process.env.NEXT_PUBLIC_GOOGLE_SHEETS_ID,
          range: 'Output!A2',
          values: [outputData]
        })
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('❌ Google Sheets API error:', res.status, errorText);
        throw new Error('Fail to input data into file.');
      }

      const data = await res.json();
      console.log('Data successfully saved:', data);
      setTimeout(() => {
        setShowSuccess(true)
      }, commonTimeoutTime)
    } catch (error) {
      console.error('Error submitting data:', error);
      setTimeout(() => {
        setShowFail(true)
      }, commonTimeoutTime)
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, commonTimeoutTime)
    }
  };



  return (
    <main className="home h-screen">



      <form
        action=""
        className={`flex flex-col gap-10 items-center w-full pt-40`}
        id="form"
      >

        {mainLoading ? (<Loading />) : (!showSuccess && !showFail) && (
          <>
            <h1 className="flex items-center justify-center header text-center p-4 text-white text-md " style={{ backgroundColor: '#3A3938', height: '80px' }}>{brandInfo?.companyTitle}</h1>

            <div className={`formContent flex flex-col gap-8 ${fade} w-full`}>
              <h3 className="text-gray-500 uppercase m-auto text-center">
                {questions[step]?.name}
              </h3>

              <Input
                label={`
      ${questions[step]?.question}`}
                placeholder="Enter your message here"
                value={answers[step]}
                onChange={handleAnswerChange}
                multiline
              />


              {step < questions.length - 1 ? (
                <Button
                  customStyle="border-1 bg-white w-fit m-auto hover:bg-gray-100 px-16 h-11.5 pt-0.5"
                  text="Next Question"
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    e.preventDefault();
                    handleStepChange('next')
                  }}
                  disabled={step >= questions.length - 1}
                  type="button"
                />
              ) : (
                <Button
                  customStyle="border-1 bg-white w-fit px-8 m-auto hover:bg-gray-100 px-16 h-11.5 pt-0.5"
                  text="Submit Survey"
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    e.preventDefault();
                    getKeyWords();
                    setLoading(true)
                  }}
                  disabled={loading}
                />
              )}


            </div>
          </>
        )}

        {!mainLoading && showSuccess && <Success />}
        {!mainLoading && showFail && <Fail />}


        <div className="formFooter">
          {loading && <Loading />}
        </div>

      </form>

      {!showSuccess && !showFail && !mainLoading && (
        <Footer length={questions.length} step={step} handleStepChange={handleStepChange} />
      )}
    </main>
  );
}
