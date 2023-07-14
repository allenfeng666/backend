"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const axios_1 = __importDefault(require("axios"));
const webScraper_1 = require("./webScraper");
const dotenv_1 = __importDefault(require("dotenv"));
const app = (0, express_1.default)();
const port = 3000;
app.use((0, cors_1.default)({
    origin: ['http://localhost:3001'],
}));
app.use(express_1.default.json());
// Load the environment variables from .env file
dotenv_1.default.config();
// Constants for ChatGPT API
const API_URL = 'https://api.openai.com/v1/chat/completions';
const API_KEY = process.env.API_KEY;
app.post('/summarize_url', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { url, length, language } = req.body;
        // Input validation
        if (!url || !length || !language) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        // Perform web scraping to extract relevant data from the webpage
        const extractedData = yield (0, webScraper_1.scrapeData)(url);
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
        const response = yield axios_1.default.post(API_URL, {
            prompt,
        }, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${API_KEY}`,
            },
        });
        // Extract the summaries from the response
        const summaries = response.data.choices[0].text.trim();
        // Return the summaries and other data
        res.status(200).json({ summaries, url, extractedData });
    }
    catch (error) {
        console.error('Error:', error);
        next(error);
    }
}));
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'An error occurred' });
});
// Error logging middleware
app.use((err, req, res, next) => {
    // Log the error here or use a logging library
    console.error(err.stack);
    res.status(500).json({ error: 'An error occurred' });
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
