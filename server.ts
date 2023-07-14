import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import axios from 'axios';
import { scrapeData } from './webScraper';
import dotenv from 'dotenv';
import { config } from 'dotenv';

const app = express();
const port = 3000;

app.use(
  cors({
    origin: ['http://localhost:3001'],
  })
);
app.use(express.json());

// Load the environment variables from .env file
dotenv.config();

// Constants for ChatGPT API
const API_URL = 'https://api.openai.com/v1/chat/completions';
const API_KEY = process.env.API_KEY;

app.post('/summarize_url', async (req: Request, res: Response, next: any) => {
  try {
    const { url, length, language } = req.body;

    // Input validation
    if (!url || !length || !language) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Perform web scraping to extract relevant data from the webpage
    const extractedData = await scrapeData(url);

    // Generate the prompt for the ChatGPT API
    const prompt = `The HTML page below is the static source code of the website. 
    You need to summarize the content of the website to provide an overview of what 
    the website does, how useful it is to the user, and some competitors of similar 
    websites. The summarization should be translated into ${language}, and around 
    ${length} words.\n
    HTML Content:\n
    ${extractedData.htmlContent}
    `;

    // Send the request to the ChatGPT API
    const response = await axios.post(
      API_URL,
      {
        prompt,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );

    // Extract the summaries from the response
    const summaries = response.data.choices[0].text.trim();

    // Return the summaries and other data
    res.status(200).json({ summaries, url, extractedData });
  } catch (error) {
    console.error('Error:', error);
    next(error);
  }
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'An error occurred' });
});

// Error logging middleware
app.use((err: any, req: Request, res: Response, next: any) => {
  // Log the error here or use a logging library
  console.error(err.stack);
  res.status(500).json({ error: 'An error occurred' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
