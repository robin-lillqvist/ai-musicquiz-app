export const prompt = `Create a music quiz for me with the following criteria:

                    Theme: ${input}.
                    Song Selection: Provide 5 songs that relate to this theme:
                    Reference Requirement: 
                    Each song must (explicitly by name) reference the theme in the lyric chorus, artist name or in the song title in a very clear and identifiable way that most people would know.
                    Each way to reference has a difficulty in the descending order: Lyrics, artist name and last and easiest is song title.
                    The connection to the theme should never be overly obscure.
                    
                    Song 1: The first song should have a moderate connection to the theme, where the song references the theme in a subtle but identifiable manner, never in the song title.
                    Song 2: The second song should have a more noticeable connection, with the theme being clearly referenced in the lyrics, preferably not int he song title.
                    Song 3: The third song should make the connection to the theme more apparent, with clear and strong references in the lyrics or the title.
                    Song 4: The fourth song should strongly reference the theme, with multiple or prominent mentions in the lyrics or once in the title.
                    Song 5: The final song should have a direct and explicit connection to the theme, with unmistakable references in the lyrics or title that make it obvious.
                    
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
                    
                    After you have generated the list of songs, go through them and order them in the order hardest to easiest.`;
