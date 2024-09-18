"use client";
import { useState, ChangeEvent } from "react";
import { Card, CardBody, Divider } from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import { Button } from "@nextui-org/button";
import { Spinner } from "@nextui-org/spinner";

import Header from "./components/Header";
import { generatePrompt } from "./utils/newPrompt";

// Define types for the quiz data
interface Song {
  verified: string;
  title: string;
  artist: string;
  album: string;
  year: number;
  lyrics: string;
  connection: string;
  difficulty: number;
}

interface QuizData {
  themeType: string;
  theme: string;
  songs: Song[];
}

export default function Home() {
  const [result, setResult] = useState<QuizData | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = () => {
    /* identifyThemeType(inputValue); */
    tryGemini(inputValue);
  };

  async function tryGemini(inputValue: string) {
    setIsLoading(true);
    setResult(null);
    setErrorMessage("");
    try {
      const response = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: generatePrompt(inputValue) }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const quizData: QuizData = data.quiz;

      setResult(quizData);
    } catch (error) {
      console.error("Error fetching quiz data:", error);
      setErrorMessage("Failed to generate a playlist. Please try another theme or try again later.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className='mainDiv'>
      <Header />
      <div>
        <div className='flex w-full flex-wrap md:flex-nowrap gap-4 items-center w-1/2 mx-auto justify-center'>
          <Input
            className='max-w-lg'
            placeholder='Type a theme to create a Musiz Quiz about'
            type='Theme'
            onChange={handleInputChange}
          />
          <Button color='secondary' onClick={handleSubmit}>
            Create
          </Button>
        </div>
        <div>{<p>{errorMessage}</p>}</div>
      </div>

      <div className='mt-6 flex w-full flex-wrap md:flex-nowrap gap-4 items-center w-1/2 mx-auto justify-center'>
        {isLoading && (
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Spinner color='secondary' label='Hold on, asking the AI.' labelColor='secondary' />
          </div>
        )}
        {result && result.songs.length > 0 ? (
          <div style={{ marginTop: "30px" }}>
            <h2>
              Quiz Suggestions on the theme: <br />
              <strong className='bold theme'>{result.theme}</strong>.
            </h2>
            <div>
              {result.songs.map((item, index) => (
                <Card
                  key={index}
                  isBlurred
                  className='card border-none dark:bg-default-100/50 max-w-[610px]'
                  shadow='sm'
                  style={{ marginTop: "30px" }}
                >
                  <div className='cardContainer'>
                    <div className='cardContent'>
                      <CardBody>
                        <h2 className='title'>
                          {index + 1}. <span className='songname'>{item.title}</span> by
                          <span className='artist'> {item.artist}</span>
                        </h2>
                        <Divider />
                        <div style={{ marginTop: "6px" }}>
                          <strong className='bold'>Album:</strong> {item.album}
                        </div>
                        <div style={{ marginTop: "6px" }}>
                          <strong className='bold'>Year:</strong> {item.year}
                        </div>
                        <div style={{ marginTop: "6px" }}>
                          <strong className='bold'>Difficulty:</strong> {item.difficulty}
                        </div>
                        <div style={{ marginTop: "6px" }}>
                          <strong className='bold'>Lyrics:</strong> {item.lyrics}
                        </div>
                        <div style={{ marginTop: "6px" }}>
                          <strong className='bold'>Connection:</strong> {item.connection}
                        </div>
                        <div style={{ marginTop: "6px" }}>
                          <strong className='bold'>Verified:</strong> {item.verified}
                        </div>
                      </CardBody>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ) : !isLoading && result !== null ? (
          <div style={{ marginTop: "10px" }}>
            <p>Sorry, that theme was too hard for me.</p>
          </div>
        ) : null}
      </div>
      <section>
        <span className='disclaimer'>
          Psst! Our AI isn&apos;t flawless. Sometimes the AI doesn&apos;t understand.
          <br />
          If the results are bad, try again until it gets it!
        </span>
      </section>
    </main>
  );
}
