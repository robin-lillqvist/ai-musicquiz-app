export const prompt = `Theme: ${inputValue}
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
                    `;
