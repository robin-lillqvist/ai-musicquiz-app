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

  async function tryGemini(input: string) {
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
                  Generate a music quiz with a focus on matching song selections to the specified theme. 
                  Use the criteria below to structure the quiz and choose songs accordingly.

                  Theme Analysis:
                  The theme can be either a specific year, a searchterm, or a combination of both. 
                  Based on this analysis, categorize the theme appropriately for song selection.
                  Reference them as "searchTerm", "Year" or "Combination".
                  
                  Song Selection Criteria:
                  General Rules:

                  Choose 10 songs that fit the theme without repeating artist or song title. 
                  If you cannot find 10 songs that fit the theme, provide as many as you can. 
                  Order songs from most difficult to least based on thematic connection strength.

                  If the Theme is a Year:
                  For years far from the current year, select globally popular songs.
                  For recent years (within the last 5 years), start with lesser-known songs and progress to more recognizable ones.
                  Balance song popularity to avoid repetition of overplayed hits.

                  If the Theme is a searchTerm:
                  Include songs where the searchTerm appears in the chorus, artist name, or song title.
                  Difficulty ranking:
                  Hardest: searchTerm in the chorus.
                  Medium: searchTerm is part of the title or clearly in the artist name.
                  Easiest: searchTerm clearly in the song title or artist name.

                  If the Theme Includes Both searchTerm and a Year:
                  Find songs that references the searchTerm in the chorus, artist name, or song title but only include songs that was released that specific year that was provided. 
                  Example "Stockholm 2009", should only result in songs related to "Stockholm" that was released the year 2009.

                  Difficulty Structure:
                  Songs 1-2: Hardest level; References theme clearly in chorus or thematically in artist name or song title. Use less well-known songs.
                  Songs 3-4: Hard difficulty; References theme clearly in chorus or thematically in artist name or song title. 
                  Songs 5-6: Medium difficulty; References theme explicitly in chorus or in artist name or song title. 
                  Songs 7-8: Easy difficulty; Strongly references theme explicitly in chorus or in artist name or song title. Must have the theme explicitly in either a prominent part of chorus, song name or artist name.
                  Songs 9-10: Easy difficulty; Very strongly references theme explicitly in chorus or in artist name or song title. Must have the theme explicitly in either a prominent part of chorus, song name or artist name.

                  Create a JSON object representing the music quiz. The structure should be:
                    {
                      "theme": "string",  // The theme of the quiz
                      "themeType": "string", // The identified wordType of the theme, e.g. Noun, Verb, Adjective, etc.
                      "songs": [
                        {
                          "title": "string",      // The title of the song
                          "artist": "string",     // The artist who performed the song
                          "album": "string",      // The album the song is from
                          "year": "int",          // The year the song was released
                          "lyrics": "string",     // The relevant lyrics that connect to the theme
                          "connection": "string", // A description of how the lyrics connect to the theme without any quotes
                          "difficulty": "int"     // Rank the difficulty from 5 (hardest) to 1 (easiest)
                        }
                      ]
                    }
                      IMPORTANT!! 
                      There should never be any quotes inside the values inside the JSON object. 

                  When creatin the JSON please use plain text without any formatting, and no quotes inside or around the JSON object.
                  Include no additional text, comments, or explanations inside or outside the JSON object.`,

          /* ` Create a music quiz for me with the following criteria:

                    Theme: ${input}.
                    Try to discern if the theme is words or a year, or both.
                    Song Selection: Provide 10 songs that relate to this theme.
                    Ensure no artist or song is repeated.

                    If the Theme is a year:
                      When the input type is a year, the further away the submitted year is from the current year, the more popular the songs should be as the difficulty decreases.
                      If the year is close to the current year (within the last 5 years), choose less well-known songs in the beginning, gradually moving to more recognizable songs for easier difficulty levels.
                      Ensure the selection is not overly repetitive with the most globally famous songs if the year is recent.
                      Avoid choosing the same overused popular songs from that year. Use lesser-known songs earlier in the quiz.
                      Never repeat the artist or song title.
                      
                    If the Theme is text:
                      Each song must contain the text string in the lyric chorus, artist name, or song title.
                      Use this difficulty ranking for references:
                        Most difficult: Theme appears in the chorus.
                        Medium difficulty: Theme is referenced clearly in the artist name and/or is referenced in an obscure way in the title.
                        Easiest: Theme appears clearly in the artist name or song title.
                      Ensure the connection to the theme is recognizable but never overly obscure.

                    Difficulty Structure:
                    Songs 1-2: For the harder songs, select songs that reference the theme in a non-obvious way. The songs should not be extremely well-known, particularly if the input year is close to the current year (less than 5 years ago). These songs can still be from that year but must be harder to identify and not globally famous.
                    Songs 3-4: Slightly easier. The theme should be more recognizable, with references in the lyrics or artist name, but not the song title.
                    Songs 5-6: Make the connection to the theme more apparent, with clear references in the lyrics or the title. These should be more recognizable songs, especially if the input year is further away (e.g., 10 or more years ago).
                    Songs 7-8: Strongly reference the theme, with multiple mentions or clear connection in either the lyrics or song title.
                    Songs 9-10: These should have a direct and explicit connection to the theme, with unmistakable mentions in the title or lyrics. If the input year is further in the past, these songs should be well-known hits from that year.

                    If the Theme contains both a a string and a number value(year): Then you must use the text rules, but only include songs released that exact year, and all the songs must EXPLICITLY and CLEARLY reference the text string part of the theme in either: song chorus, artist name or song title.

                    After generating the list of songs, order them from hardest to easiest, based on the connection strength to the theme.

                    JSON Output:
                    Create a JSON object representing the music quiz. The structure should be:
                    {
                      "theme": "string",  // The theme of the quiz
                      "themeType": "string", // The identified wordType of the theme, e.g. Noun, Verb, Adjective, etc.
                      "songs": [
                        {
                          "title": "string",      // The title of the song
                          "artist": "string",     // The artist who performed the song
                          "album": "string",      // The album the song is from
                          "year": "int",          // The year the song was released
                          "lyrics": "string",     // The relevant lyrics that connect to the theme
                          "connection": "string", // A description of how the lyrics connect to the theme without any quotes
                          "difficulty": "int"     // Rank the difficulty from 5 (hardest) to 1 (easiest)
                        }
                      ]
                    }
                    JSON Requirements:
                    1. The "theme" key should contain the theme of the quiz as a string.
                    2. The "songs" array should contain exactly 10 objects, each representing a song.
                    3. Each song object should have the following keys: "title", "artist", "album", "year", "lyrics", "connection", and "difficulty".
                    4. Difficulty: The "difficulty" key should reflect a gradual decrease in difficulty, from 5 (most difficult) to 1 (easiest), based on how well-known the songs are and how clear the reference is.
                    5. The "title" key should contain the song's title.
                    6. The "artist" key should contain the artist's name.
                    7. The "lyrics" key should contain a snippet of the song's lyrics that connects to the theme.
                    8. The "connection" key should describe how the lyrics relate to the theme.
                    9. The JSON object should be returned as a plain JSON object without any extra text, quotes, explanations, or comments inside or wrapping it.
                    10. NEVER use quotes of any kind within the object values, or around the JSON object, this is very important.
                   ` */
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate content");
      }

      const data = await response.json();
      const quizData: QuizData = JSON.parse(data.quiz);

      console.log(quizData);

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
        <div>{<p>{errorMessage}</p>}</div>
      </div>

      <div className='mt-6 flex w-full flex-wrap md:flex-nowrap gap-4 items-center w-1/2 mx-auto justify-center'>
        {isLoading && (
          <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
            <Spinner label='Hold on, asking the AI.' color='secondary' labelColor='secondary' />
          </div>
        )}
        {result && result.songs.length > 0 ? (
          <div style={{ marginTop: "30px" }}>
            <h2>
              Quiz Suggestions on the theme: <strong className='bold theme'>{result.theme}</strong> ({result.themeType})
            </h2>
            <div>
              {result.songs.map((item, index) => (
                <Card style={{ marginTop: "30px" }} className='card' key={index}>
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
