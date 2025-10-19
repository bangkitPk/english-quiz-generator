import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Replicate from "replicate";

// --- Basic Setup ---
dotenv.config();
const app = express();
const port = 3000;

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Initialize Replicate Client ---
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// --- API Endpoint for Quiz Generation ---
app.post("/api/generate-quiz", async (req, res) => {
  try {
    const { lessonContent } = req.body;
    if (!lessonContent) {
      return res.status(400).json({ error: "Lesson content is required." });
    }

    const model = "google/gemini-2.5-flash";
    // const model = "ibm-granite/granite-3.3-8b-instruct:618ecbe80773609e96ea19d8c96e708f6f2b368bb89be8fad509983194466bf8";

    const prompt = `
You are an expert English linguist and teacher designing a quiz.
Generate exactly 5 unique multiple-choice questions about ---
${lessonContent} 
---
to improves student understanding about the topic.

Your entire response MUST be a single, valid JSON array of objects. Your response must start with '[' and end with ']'.

The JSON structure for each object must be:
{
  "question": "An incomplete sentence with a blank ____.",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctAnswer": "The correct option from the list"
}
Make sure you provide the question and correctAnswer grammatically correct
`;

    const input = {
      prompt: prompt,
      temperature: 1,
      max_output_tokens: 65535,
      top_p: 0.95,
    };

    console.log("Calling Replicate API...");
    const output = await replicate.run(model, { input });

    // Join the streamed output into a single string
    const rawOutput = output.join("");

    // Find the start and end of the JSON array to handle extra text
    const startIndex = rawOutput.indexOf("[");
    const endIndex = rawOutput.lastIndexOf("]");

    if (startIndex === -1 || endIndex === -1) {
      console.error("Could not find JSON array in the AI response:", rawOutput);
      return res
        .status(500)
        .json({ error: "Failed to generate quiz due to invalid format." });
    }

    // Extract the JSON string
    const quizJsonString = rawOutput.substring(startIndex, endIndex + 1);

    // Parse the cleaned string
    const quizData = JSON.parse(quizJsonString);
    res
      .status(200)
      .json({ message: "Quiz generated successfully", data: quizData });
  } catch (error) {
    console.error("Error calling Replicate API:", error);
    // Check if the error is a JSON parsing error and provide a specific message
    if (error instanceof SyntaxError) {
      res.status(500).json({
        error:
          "Failed to parse the quiz data from the AI. The format was invalid.",
      });
    } else {
      res.status(500).json({ error: "Failed to generate quiz." });
    }
  }
});

// --- Mock Data Endpoint for Lessons ---
app.get("/api/lessons", (req, res) => {
  const lessons = [
    {
      id: 1,
      title: "Introduction to Present Simple Tense",
      content:
        "The Present Simple Tense in English Grammar is used to describe habits, routines, general truths, and fixed arrangements. It's formed with the base form of the verb (for he, she, it: third person singular add 's' to the verb), and \"do/does\" for questions and negative sentences.\n\nStructure:\nSubject + Verb (base form)\n\nExamples:\n1. I work as a software engineer. (habitual action)\n2. She lives in London. (general truth)\n3. The Earth revolves around the Sun. (scientific fact)\n4. They play football every Sunday. (routine)\n5. Do you speak French? (asking about ability or habit)\n6. She doesn't like spinach. (negative sentence)\n\nNote: The Present Simple Tense is not used for actions happening at a specific time in the future or for actions in progress at the moment of speaking. For those, we use other tenses like Present Continuous or Future Simple.",
    },
    {
      id: 2,
      title: "Articles: A, An, The",
      content:
        'Articles in English grammar, namely "a," "an," and "the," are used to specify definiteness or indefiniteness of a noun. Here’s a breakdown:\n\n1. **Indefinite Articles: a, an**\n   - "A" and "an" are used when referring to non-specific or any member of a group.\n   - "A" is used before words that begin with a consonant sound (e.g., a book, a cat).\n   - "An" is used before words that begin with a vowel sound (e.g., an apple, an umbrella).\n\nExamples:\n- I have a dog. (any dog, not a specific one)\n- She is reading an interesting book. (any interesting book, not a specific one)\n\n2. **Definite Article: the**\n   - "The" is used when referring to a specific or particular noun.\n   - It can also be used with singular and plural countable nouns, as well as uncountable nouns, when the context makes it clear what is being referred to.\n\nExamples:\n- The cat is sleeping on the couch. (a specific cat and couch)\n- I need the book you lent me. (a specific book)\n- The water in the river is cold today. (a specific body of water)\n\n3. **No Article**\n   - Some nouns do not take an article, especially when they refer to abstract concepts, activities, or unique, one-of-a-kind items.\n\nExamples:\n- Love is a powerful emotion. (no article)\n- She enjoys swimming. (no article)\n- The Eiffel Tower is in Paris. (unique noun, "the" is used)\n\n4. **Plural Countable Nouns**\n   - Plural countable nouns usually don\'t take an article, although "the" can be used for emphasis or to refer to something specific.\n\nExamples:\n- Dogs are friendly animals. (no article)\n- The dogs are barking loudly. (specific dogs)\n\n5. **Uncountable Nouns**\n   - Uncountable nouns (like milk, advice, or furniture) typically don\'t take an article.\n\nExamples:\n- She drank some milk. (no article)\n- I need your advice. (no article)\n- This furniture is expensive. (no article)\n\nRemember, the usage of articles can be tricky, and there are exceptions. Context and understanding the specific situation often help determine when to use "a," "an," or "the."\n',
    },
    {
      id: 3,
      title: "Prepositions of Place: In, On, At",
      content:
        "Prepositions of place are words like 'in,' 'on,' and 'at' that show the relationship between a place and another part of the sentence. They indicate where something is located or where an action is taking place. Here's a comprehensive explanation of 'in,' 'on,' and 'at':\n\n1. In:\n'In' is used to indicate enclosed spaces or areas, or to describe a position within something. It can also be used for streets and some countries.\n\n- Enclosed spaces: in the box, in the room, in the car, in the house\n- Areas or regions: in Europe, in Africa, in the city, in the countryside\n- Position within something: in the morning, in summer, in the middle, in front of\n\nExamples:\n- The book is in the drawer.\n- She lives in Paris.\n- We are in the library.\n- It's in the nature of humans to explore.\n- He was born in 1990.\n\n2. On:\n'On' is used for surfaces or flat planes, for specific days, and for public transportation.\n\n- Surfaces or flat planes: on the table, on the chair, on the floor, on the page\n- Specific days: on Monday, on Tuesday, on birthdays\n- Public transportation: on the bus, on the train, on the plane\n\nExamples:\n- The cat is sleeping on the couch.\n- She was born on March 15th.\n- We will travel on the Eurostar.\n- The presentation is due on Friday.\n\n3. At:\n'At' is used for specific addresses, precise points in time, and to indicate the exact location of something or someone.\n\n- Specific addresses: at the school, at the hospital, at the post office, at home\n- Precise points in time: at 3 PM, at noon, at midnight, at dawn\n- Exact location: at the door, at the corner, at the edge, at the top, at the bottom\n\nExamples:\n- I will meet you at the coffee shop.\n- The meeting is at 2 PM tomorrow.\n- She arrived at the airport.\n- The bird is at the feeder.\n\nHere are some additional points to remember:\n\n- 'In' and 'on' can sometimes be interchangeable, but there's usually a subtle difference in meaning. For example, 'in' is more common with larger areas, while 'on' is used for surfaces or specific points. However, this rule isn't hard and fast, and context is crucial.\n\n  Incorrect: *On the beach, children played in the water.* (Should be: *On the beach, children played *in* the water.*)\n\n- 'At' is often used for more precise locations or times compared to 'in' and 'on.'\n\n  Incorrect: *I'll see you *at* 3 o'clock.* (Should be: *I'll see you *in* the afternoon/at noon.*)\n\n- Some prepositions can combine with 'in,' 'on,' or 'at' to create more specific expressions. For example:\n\n  - Inside (in), outside (in), under (under), over (over), between (between), among (among), amongst (amongst)\n\n- Certain nouns can take 'in,' 'on,' or 'at' depending on their nature. For instance, 'school' can take 'in' (I'm in school) or 'at' (I'll meet you at school).\n\n- In informal English, 'on' can sometimes replace 'at' for indicating specific places, especially when referring to well-known or frequently mentioned locations.\n\n  Informal: *I'll see you on the corner.* (More formal: *I'll see you at the corner.*)\n\nMastering prepositions of place takes practice and exposure to various contexts. Paying attention to how native speakers use these prepositions in everyday conversations and written texts will help solidify your understanding.",
    },
  ];
  res.json(lessons);
});

// --- Start the Server ---
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
