import express, { Request, Response } from 'express';
import cors from 'cors';
import axios from 'axios';
import { scrapeData } from './webScraper';

const app = express();
const port = 3000;

app.use(express.json());
app.use(
  cors({
    origin: ['http://localhost:3001'],
  })
);

// Constants for ChatGPT API
const API_URL = 'https://api.openai.com/v1/chat/completions';
const API_KEY = 'YOUR_API_KEY';

app.post('/summarize_url', async (req: Request, res: Response) => {
  try {
    const { url, languages } = req.body;

    // Perform web scraping to extract relevant data from the webpage
    const extractedData = await scrapeData(url);

    // Perform translation using the selected translation service
    const translatedData = await translateData(extractedData, languages);

    // Generate customized summaries for each language
    const summaries = await generateSummaries(
      url,
      languages,
      translatedData,
      extractedData
    );

    res.status(200).json({ summaries });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Simulated function for translation
async function translateData(data: any, languages: string[]): Promise<any> {
  try {
    // Simulate translation using an external translation service or library
    // Implement your translation logic here
    // ...
    // Return the translated data
    return {
      ...data,
      translatedContent: 'Translated Content',
      // Add other translated fields as needed
    };
  } catch (error) {
    console.error('Error translating data:', error);
    throw error;
  }
}

// Simulated function for generating summaries
async function generateSummaries(
  url: string,
  languages: string[],
  translatedData: any,
  extractedData: any
): Promise<any> {
  try {
    // Prepare input for the ChatGPT API
    const prompt = `URL: ${url}\n\nExtracted Data:\n${JSON.stringify(
      extractedData,
      null,
      2
    )}\n\n`;
    const maxTokens = 50; // Adjust the desired maximum number of tokens in the response

    // Send the request to the ChatGPT API
    // const response = await axios.post(
    //   API_URL,
    //   {
    //     prompt,
    //     max_tokens: maxTokens,
    //   },
    //   {
    //     headers: {
    //       'Content-Type': 'application/json',
    //       Authorization: `Bearer ${API_KEY}`,
    //     },
    //   }
    // );

    // Return the summaries
    // const summaries = response.data.choices[0].text.trim();

    const summaries = extractedData;

    return {
      Language: languages,
      url,
      extractedData,
      summaries,
    };
  } catch (error) {
    console.error('Error generating summaries:', error);
    throw error;
  }
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
