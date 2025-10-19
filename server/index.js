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
    const { lessonTitle } = req.body;
    if (!lessonTitle) {
      return res.status(400).json({ error: "Lesson title is required." });
    }

    const model = "google/gemini-2.5-flash";
    // const model = "ibm-granite/granite-3.3-8b-instruct:618ecbe80773609e96ea19d8c96e708f6f2b368bb89be8fad509983194466bf8";

    const prompt = `
You are an expert English linguist and teacher designing a quiz.
Generate exactly 5 unique multiple-choice questions about ---
${lessonTitle} 
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
    {
      id: 4,
      title: "The Simple Past Tense",
      content:
        "The Simple Past Tense in English Grammar is used to describe actions, events, or states that started and finished at a specific time in the past. It is the most common tense for telling stories or talking about past experiences.\n\nIt's formed by adding '-ed' to the base form of regular verbs (e.g., walk -> walked). Irregular verbs have their own unique past tense forms (e.g., go -> went). For questions and negative sentences, we use the auxiliary verb 'did' with the base form of the main verb.\n\nStructure:\nPositive: Subject + Verb (-ed / irregular form)\nNegative: Subject + did not + Verb (base form)\nQuestion: Did + Subject + Verb (base form)?\n\nExamples:\n1. He visited his grandparents last week. (completed action with a regular verb)\n2. She went to the cinema yesterday. (completed action with an irregular verb)\n3. They didn't finish the project on time. (negative sentence)\n4. Did you see the movie? (question)\n5. I was tired after the long journey. (past state using the verb 'to be')\n\nNote: The Simple Past Tense is used for actions that are completely finished. It should not be confused with the Present Perfect (which connects the past to the present) or the Past Continuous (which describes an action that was in progress in the past).",
    },
    {
      id: 5,
      title: "Conjunctions (Connecting Words)",
      content:
        "Conjunctions in English Grammar are words used to connect words, phrases, or clauses (parts of a sentence). They are essential for creating complex, fluent, and logical sentences instead of using short, choppy ones.\n\nThere are several types of conjunctions, but the most common are Coordinating and Subordinating.\n\nCoordinating Conjunctions (FANBOYS): These connect items of equal grammatical rank (e.g., two nouns, two verbs, or two independent clauses). The seven coordinating conjunctions are For, And, Nor, But, Or, Yet, So.\nSubordinating Conjunctions: These connect a dependent clause (which cannot stand alone) to an independent clause. Common examples include 'because', 'since', 'although', 'while', and 'if'.\n\nExamples:\n1. I wanted to watch a movie, but I was too tired. (Coordinating: connecting two independent clauses)\n2. She studied hard, so she passed the exam. (Coordinating: showing a result)\n3. He was late because he missed the bus. (Subordinating: giving a reason)\n4. Although it was cold, he went out without a jacket. (Subordinating: showing contrast)\n5. You can play outside after you finish your homework. (Subordinating: indicating time)\n\nNote: Conjunctions are the glue of English sentences. Mastering them allows you to express the relationship between different ideas, such as cause and effect, contrast, and condition, making your speech and writing much more sophisticated.",
    },
    {
      id: 6,
      title: "The Present Continuous",
      content:
        "The Present Continuous Tense in English Grammar is used to describe actions that are happening at the exact moment of speaking. It is also used for temporary situations and for definite future arrangements.\n\nIt's formed using the present tense of the verb 'to be' (am, is, are) followed by the main verb with an '-ing' ending. This structure emphasizes that an action is in progress.\n\nStructure:\nPositive: Subject + am/is/are + Verb-ing\nNegative: Subject + am/is/are + not + Verb-ing\nQuestion: Am/Is/Are + Subject + Verb-ing?\n\nExamples:\n1. Look! It is raining outside. (action happening now)\n2. I am currently working on a new project. (temporary situation)\n3. She is not listening to the music. (negative sentence)\n4. What are you doing right now? (question about a current activity)\n5. They are meeting their friends for dinner tonight. (definite future plan)\n\nNote: The Present Continuous is for actions in progress or temporary situations. It should not be confused with the Simple Present Tense, which is used for habits, routines, and general truths. For example, 'I play tennis' (a habit) vs. 'I am playing tennis' (right now).",
    },
    {
      id: 7,
      title: "Conditional (If-Clauses)",
      content:
        "Conditionals in English Grammar, also known as 'If-Clauses', are sentences used to express that an action can only take place if a certain condition is fulfilled. They explore the results of real and imagined situations, from scientific facts to hypothetical scenarios in the past. There are four main types.\n\n1. Zero Conditional: Used for general truths and scientific facts, where one condition always leads to the same result.\nStructure: If + Present Simple, ... Present Simple.\n\n2. First Conditional: Used for realistic situations in the present or future. It describes a likely outcome if the condition happens.\nStructure: If + Present Simple, ... will + base verb.\n\n3. Second Conditional: Used for hypothetical or unlikely situations in the present or future. It is often used for dreaming or giving advice.\nStructure: If + Past Simple, ... would + base verb.\n\n4. Third Conditional: Used to describe a hypothetical situation in the past that did not happen, often to express regret.\nStructure: If + Past Perfect, ... would have + past participle.\n\nExamples:\n1. If you freeze water, it becomes ice. (Zero Conditional: fact)\n2. If she studies hard, she will pass the exam. (First Conditional: real future possibility)\n3. If I were a rich man, I would travel the world. (Second Conditional: unreal present situation)\n4. What would you do if you won the lottery? (Second Conditional: question)\n5. If he had listened to my advice, he wouldn't have made that mistake. (Third Conditional: unreal past/regret)\n\nNote: Mastering conditionals is crucial for expressing complex ideas. The key is to match the correct structure to the timeframe you are talking about (a general fact, a possible future, an unreal present, or an unreal past).",
    },
    {
      id: 8,
      title: "Countable and Uncountable Nouns",
      content:
        "Nouns in English are categorized as either Countable or Uncountable. Understanding this distinction is essential for correctly using articles (a, an, the) and quantifiers (some, many, much).\n\nCountable Nouns\nThese are individual items, people, or places that can be counted. They have both a singular and a plural form (e.g., adding '-s' or '-es'). You can use numbers and the articles 'a/an' with them.\n\nUncountable Nouns\nThese are substances, materials, concepts, or abstract ideas that we cannot count individually. They are treated as a whole or a mass and typically only have a singular form. You cannot use numbers or 'a/an' directly with them.\n\nExpressing Quantity\nTo talk about the quantity of an uncountable noun, we use quantifiers like 'some', 'any', 'much', 'a little', 'a lot of', or specific units of measurement like 'a cup of', 'a piece of', or 'a bottle of'.\n\nExamples:\n1. I bought a book. (Countable, singular)\n2. She has three cats. (Countable, plural)\n3. He needs some water. (Uncountable with quantifier)\n4. Can I give you a piece of advice? (Uncountable with a unit of measurement)\n5. There isn't much sugar left. (Uncountable with 'much' in a negative sentence)\n6. How many chairs do we need? (Countable with 'many' in a question)\n\nNote: The fundamental test is to ask 'Can I put a number in front of it?'. You can say 'two dogs' (countable), but you cannot say 'two furnitures' (uncountable). Remember to use 'many' with countable nouns and 'much' with uncountable nouns.",
    },
    {
      id: 9,
      title: "Prepositions of Time: In, On, At",
      content:
        "Prepositions of Time in English Grammar are small words used to indicate when something happens. The three most common and important prepositions of time are IN, ON, and AT, which are used to specify time from general to very specific.\n\n### IN\nUsed for general, longer periods of time, such as months, years, seasons, decades, and centuries.\n- Months: in October\n- Seasons: in summer\n- Years: in 2025\n- Parts of the day: in the morning, in the afternoon, in the evening\n\n### ON\nUsed for more specific periods, like single days and dates.\n- Days of the week: on Sunday\n- Specific dates: on October 19th\n- Holidays with the word 'Day': on New Year's Day\n\n### AT\nUsed for very specific, precise times.\n- Clock times: at 7:00 PM\n- Specific points in the day: at noon, at midnight, at night\n- Mealtimes: at lunchtime\n- Holidays without the word 'Day': at Christmas\n\nExamples:\n1. My birthday is in January. (Month)\n2. The meeting is on Monday. (Day)\n3. The movie starts at 9 PM. (Precise time)\n4. He was born in 1998. (Year)\n5. I will see you on Christmas Day. (Holiday with 'Day')\n6. We often visit family at Christmas. (Holiday period)\n\nNote: A simple way to remember the rule is to think of a pyramid. IN is at the broad base (longest periods), ON is in the middle (days/dates), and AT is at the sharp point (most specific times).",
    },
  ];
  res.json(lessons);
});

// --- Start the Server for local development ---
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
