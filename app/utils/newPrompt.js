export function generatePrompt(input) {
  return `I am developing a music quiz feature for my app that fetches data through an API request to Gemini AI. The quiz will present users with a theme and five songs connected to that theme with varying levels of difficulty. The connections must be objective and literal, avoiding any emotional, mental, or mood-based links.

Purpose: The music quiz aims to engage users by challenging their knowledge of songs related to specific themes. Each quiz will present a theme and five songs that are connected to that theme in different levels of difficulty.

Usage: The JSON data generated will be used to display the quiz questions and answers within the app, allowing users to guess the songs based on their connections to the theme.

Audience: The target audience includes music enthusiasts and casual listeners who enjoy testing their knowledge through quizzes.

Technical Requirements:

Ensure that the JSON structure adheres strictly to the specified format, with no additional text, block markings, or explanations.
All fields must be correctly populated, and keys or values should not contain embedded quotation marks.
Do not include any code block markers, formatting markers, markdown formatting, or other block markings in your response.
Objective: Create a music quiz based on a specified theme with objective and literal song connections.

Theme and Song Selection:

Theme: ${input}
Song Selection: Provide 5 songs that relate to this theme with objective and literal connections.
Reference Requirement:

Each song must directly or indirectly reference the theme by name in the lyric chorus, artist name, or song title in a clear and identifiable way.
Connections must be objective, avoiding emotional, mental, or mood-based links.
Use closely related terms over direct mentions for harder songs, but without obscure references.
Difficulty of references should increase as the connection becomes less obvious, using related subjects and concepts when necessary.
Song Specifications:

Song 1: Easy connection with the theme directly mentioned in the title.
Song 2: Medium connection with the theme referenced through related objects or concepts.
Song 3: Hard connection with the theme referenced indirectly without mentioning the theme word.
Song 4: More challenging connection with minimal direct references, using closely related ideas.
Song 5: Most challenging connection with the theme implied through abstract or associated concepts without direct mentions.
Ensure that the theme is always referenced in the lyrics or title, with each subsequent song having a less obvious and more indirect link to the theme than the previous one.

Connection Criteria:

Easy (Difficulty 1):

Connection: Directly mention the theme in the song title.
Example: Theme: "Flying" → Song: "Fly Away" by Lenny Kravitz
Medium (Difficulty 2-3):

Connection: Reference related objects or concepts without mentioning the theme word.
Example: Theme: "Flying" → Song: "Aeroplane" by Red Hot Chili Peppers
Hard (Difficulty 4-5):

Connection: Indirectly reference the theme through associated ideas without direct mentions.
Example: Theme: "Flying" → Song: "Up Where We Belong" by Joe Cocker
Theme Reference Requirements:

Each song must directly or indirectly reference the theme by name in the lyric chorus, artist name, or song title in a clear and identifiable way.
Connections must be objective, avoiding emotional, mental, mood-based links, or subjective interpretations.
Use direct mentions or closely related terms without obscure references; for harder songs, opt for closely related terms over direct mentions but still avoid obscurity.
The difficulty of references should increase as the connection becomes less obvious, utilizing related subjects and concepts when necessary.
Do not use quotation marks within the values of the JSON object.
The response should be a plain JSON object without any explanations, comments, additional text, code block formatting, or other block markings.
Difficulty Ranking:

1 (Easy): Direct mention of the theme in the song title.
2-3 (Medium): References through related objects or concepts without mentioning the theme word.
4-5 (Hard): Indirect references through associated ideas without direct mentions.
Ordering Instruction: After generating the list of songs, order them from hardest (5) to easiest (1) based on the difficulty of their connection to the theme.

Validation:

Objective and Literal Connections: Ensure each song's connection to the theme is objective and literal.
Indirect References for Hard Songs: Verify that harder songs do not mention the theme word directly.
JSON Compliance: Confirm that the JSON structure is correctly formatted with all required fields populated accurately.
Ensure that the theme is always referenced in the lyrics, artist name, or title, with each difficulty level having a less obvious and more indirect link to the theme than the previous one.
When you are done, create a JSON object representing the music quiz song selection.

The JSON object should have the following structure where there should be 5 songs:

{ "theme": "string", // The theme of the quiz "songs": [ { "title": "string", // The title of the song "artist": "string", // The artist who performed the song "album": "string", // The album of the song "year": int, // The year the song was released "lyrics": "string", // The relevant lyrics that connect to the theme "connection": "string", // A description of how the lyrics connect to the theme "difficulty": int // Rank the difficulty from 5 (hard) to 1 (easy) } ] }

Requirements:

The "theme" key should contain the theme of the quiz as a string.
The "songs" array should contain exactly 5 objects, each representing a song.
Each song object should have the following keys: "title", "artist", "album", "year", "lyrics", "connection", and "difficulty".
The "title" key should contain the song's title.
The "artist" key should contain the artist's name.
The "album" key should contain the album of the song.
The "year" key should contain the year the song was released as an integer.
The "lyrics" key should contain a snippet of the song's lyrics that connects to the theme.
The "connection" key should describe how the lyrics relate to the theme.
The "difficulty" key should rank the difficulty from 5 (hard) to 1 (easy).
The JSON object should be returned as a plain JSON object without any extra text, explanations, comments, code block formatting, or other block markings.
Never use quotation marks within the object values.
Do not include any markdown formatting, code block markers, or other formatting markers in your response.
The response should be a single, valid JSON object without any wrapping or additional text.
After you have generated the list of songs, go through them and order them in the order hardest to easiest.

IMPORTANT: Your entire response must be a single, valid JSON object. Do not include any text before or after the JSON object, and do not use any markdown formatting, code block markers, or other block markings.

`;
}
