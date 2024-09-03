"use client";
import { useState, ChangeEvent } from "react";
import { Card, CardBody, Divider } from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import { Button } from "@nextui-org/button";
import { Spinner } from "@nextui-org/spinner";

// Define types for the quiz data
interface Song {
  title: string;
  artist: string;
  album: string;
  year: number;
  lyrics: string;
  connection: string;
  difficulty: number;
}

interface QuizData {
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
    tryClaude(inputValue);
  };

  async function tryClaude(input: string) {
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
          prompt: ` Create a music quiz for me with the following criteria:

                    Theme: ${input}.
                    Song Selection: Provide 10 songs that relate to this theme:
                    Reference Requirement: 
                    Each song must (explicitly by name) reference the theme in the lyric chorus, artist name or in the song title in a very clear and identifiable way that most people would know.
                    Each way to reference has a difficulty in the descending order: Lyrics, artist name and last and easiest is song title.
                    The connection to the theme should never be overly obscure.
                    
                    Song 1-2: The first songs should have a connection to the theme, where the song references the theme in a non-obvious but still identifiable manner, never in the song title.
                    Song 3-4: The second songs should have a more noticeable connection, with the theme being clearly referenced in the lyrics or , preferably not in the song title.
                    Song 5-6: The third songs should make the connection to the theme more apparent, with clear and strong references in the lyrics or the title.
                    Song 7-8: The fourth songs should strongly reference the theme, with multiple or prominent mentions in the lyrics or once in the title.
                    Song 9-10: The final songs should have a direct and explicit connection to the theme, with unmistakable references in the lyrics or title that make it obvious.
                    
                    Ensure that the theme is always referenced in the lyrics or title, with each subsequent song having a stronger and more recognizable link to the theme than the previous one."

                    Create a JSON object representing the music quiz. 
                    The JSON object should have the following structure:
                    {
                        "theme": "string", // The theme of the quiz
                        "songs": [
                          {
                            "title": "string",      // The title of the song
                            "artist": "string",     // The artist who performed the song
                            "album": "string",      // The album of the song
                            "year": "int",          // The year the song was released
                            "lyrics": "string",     // The relevant lyrics that connect to the theme
                            "connection": "string"  // A description of how the lyrics connect to the theme
                            "difficulty": "int"     // Rank the difficulty from 5 (hard) to 1 (easy)
                          }
                        ]
                      }
                    
                    Requirements:
                    1. The "theme" key should contain the theme of the quiz as a string.
                    2. The "songs" array should contain exactly 5 objects, each representing a song.
                    3. Each song object should have the following keys: "title", "artist", "lyrics", and "connection".
                    4. The "title" key should contain the song's title.
                    5. The "artist" key should contain the artist's name.
                    6. The "lyrics" key should contain a snippet of the song's lyrics that connects to the theme.
                    7. The "connection" key should describe how the lyrics relate to the theme.
                    8. The JSON object should be returned as a plain JSON object without any extra text, explanations, or comments.
                    9. Never use quotes of any kind within the object values.
                    
                    After you have generated the list of songs, go through them and order them in the order hardest to easiest.`,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate content");
      }

      const data = await response.json();
      const quizData: QuizData = JSON.parse(data.quiz);

      setResult(quizData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setErrorMessage("Failed to generate a playlist, try another theme.");
    }
    setIsLoading(false);
  }

  return (
    <main className='mainDiv'>
      <h1>Music Quizzer</h1>
      <div>
        <div className='mt-8 flex w-full flex-wrap md:flex-nowrap gap-4 items-center w-1/2 mx-auto justify-center'>
          <Input
            type='Theme'
            label='Type a theme to create a Quiz about'
            onChange={handleInputChange}
            /* color={"secondary"} */
            className='max-w-lg'
          />
          <Button color='secondary' onClick={handleSubmit}>
            Create
          </Button>
        </div>
      </div>
      <div>{<p>{errorMessage}</p>}</div>
      <div className='mt-6 flex w-full flex-wrap md:flex-nowrap gap-4 items-center w-1/2 mx-auto justify-center'>
        {isLoading && (
          <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
            <Spinner label='Hold on, asking the AI.' color='secondary' labelColor='secondary' />
          </div>
        )}
        {result && result.songs.length > 0 ? (
          <div style={{ marginTop: "30px" }}>
            <h3>Quiz Suggestions:</h3>
            <div>
              {result.songs.map((item, index) => (
                <Card style={{ marginTop: "30px" }} className='card' key={index}>
                  <CardBody>
                    <h2 className='title'>
                      {index + 1}. <span className='songname'>{item.title}</span> by{" "}
                      <span className='artist'>{item.artist}</span>
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
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        ) : !isLoading && result === null ? (
          <div style={{ marginTop: "10px" }}>
            <p>No results yet.</p>
          </div>
        ) : (
          !isLoading && (
            <div style={{ marginTop: "10px" }}>
              <p>Sorry, that theme was too hard for me.</p>
            </div>
          )
        )}
      </div>
    </main>
  );
}
