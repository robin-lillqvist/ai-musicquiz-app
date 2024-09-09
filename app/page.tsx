"use client";
import { useState, ChangeEvent } from "react";
import { Card, CardBody, Divider } from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import { Button } from "@nextui-org/button";
import { Spinner } from "@nextui-org/spinner";

import Header from "./components/Header";

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

  /* async function identifyThemeType(input: string) {
    setIsLoading(true);
    setResult(null);
    setErrorMessage("");
    try {
      const response = await fetch("/api/identify-theme", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: `${input}`,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to identify the input content");
      }

      const data = await response.json();

      tryGemini(inputValue, data.wordType);
    } catch (error) {
      console.error("Error fetching data in the identification:", error);
      setErrorMessage("Could not Identify the theme.");
      setIsLoading(false);
    }
  } */

  async function tryGemini(inputValue: string) {
    setIsLoading(true);
    setResult(null);
    setErrorMessage("");
    try {
      const response = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: `Theme: ${inputValue}
                    Generate a music quiz focused on matching song selections to the specified theme. Based on whether the theme is a specific year, a search term, or both, categorize it appropriately for song selection.

                    Song Selection Criteria:
                    Choose 5 songs that fit the theme without repeating artist or song title. If fewer than 5 songs fit, provide as many as you can.

                    Theme Specific Instructions:
                    - If the theme is a Year:
                      - For years far from the current year, select globally popular songs.
                      - For recent years (within the last 5 years), start with lesser-known songs and progress to more recognizable ones.
                      - Balance song popularity to avoid repetition of overplayed hits.
                    - If the theme is a text string:
                      - Include songs where the theme appears explicitly in the chorus, artist name, or song title.

                    Music Quiz Difficulty Structure Specification:
                    - Level 3 - Hard Difficulty (Songs 1-2):
                      - Choose songs related to the theme through indirect references (e.g., for a theme "Cat", include terms like "Claws", "Whiskers"). Avoid explicit mentions in song titles or artist names.
                    - Level 2 - Medium Difficulty (Song 3):
                      - Build on the previous level by allowing explicit mentions of the theme in the artist's name.
                    - Level 1 - Easy Difficulty (Songs 4-5):
                      - Further relax the rules to include explicit mentions of the theme in song titles.

                    General Instructions for AI:
                    - Verification: Confirm all songs are real and their thematic connections are verifiable via reliable sources like music databases.
                    - Accuracy: Ensure that thematic references in lyrics, titles, and cultural contexts are accurately represented.
                    - Diversity: Include a variety of music genres and styles to appeal broadly and provide a comprehensive theme representation.

                    If the Theme Includes Both a Text String and a Year:
                    - Find songs that explicitly mention the text string in the chorus, artist name, or song title and were released in the specified year.

                    Song Information Verification:
                    - Verify all song details against reliable sources like Spotify or Apple Music.
                    - Include only songs with confirmed details. Avoid using fabricated or inaccurately described songs.
                    - Use multiple sources to confirm song information and ensure accuracy.

                    Reorder songs in descending order from highest to lowest difficulty.

                    Create a JSON object representing the music quiz:
                    {
                      "theme": "string",
                      "themeType": "string",
                      "songs": [
                        {
                          "title": "string",
                          "artist": "string",
                          "album": "string",
                          "year": "int",
                          "lyrics": "string",
                          "connection": "string",
                          "difficulty": "int",
                          "verified": "string"
                        }
                      ]
                    }

                    IMPORTANT: When creating the JSON, use plain text without any formatting, and ensure no quotes or apostrophes are inside any of the JSON object values. Include no additional text, comments, or explanations inside or outside the JSON object.
                    Before sending the response you must order the songs in descending order by difficulty. 
                    Also make sure the response is formatted like the JSON provided above, without any wrapping characters.
                    `,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate content");
      }

      const data = await response.json();
      const quizData: QuizData = JSON.parse(data.quiz);

      setResult(quizData);
    } catch (error) {
      console.error("Error fetching quiz data:", error);
      setErrorMessage(
        "Failed to generate a playlist from the inputted theme, please try another theme. Sometimes the AI sends back wierd text and the code breaks. You could try again!"
      );
    }
    setIsLoading(false);
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
            }}>
            <Spinner
              color='secondary'
              label='Hold on, asking the AI.'
              labelColor='secondary'
            />
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
                  style={{ marginTop: "30px" }}>
                  <div className='cardContainer'>
                    <div className='cardContent'>
                      <CardBody>
                        <h2 className='title'>
                          {index + 1}.{" "}
                          <span className='songname'>{item.title}</span> by
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
                          <strong className='bold'>Difficulty:</strong>{" "}
                          {item.difficulty}
                        </div>
                        <div style={{ marginTop: "6px" }}>
                          <strong className='bold'>Lyrics:</strong>{" "}
                          {item.lyrics}
                        </div>
                        <div style={{ marginTop: "6px" }}>
                          <strong className='bold'>Connection:</strong>{" "}
                          {item.connection}
                        </div>
                        <div style={{ marginTop: "6px" }}>
                          <strong className='bold'>Verified:</strong>{" "}
                          {item.verified}
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
          Psst! Our AI isn&apos;t flaweless. Sometimes the AI doesn&apos;t
          understand.
          <br />
          If the results are bad, try again until it gets it!
        </span>
      </section>
    </main>
  );
}
