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
const webScraper_1 = require("./webScraper");
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: ['http://localhost:3001'],
}));
// Constants for ChatGPT API
const API_URL = 'https://api.openai.com/v1/chat/completions';
const API_KEY = 'YOUR_API_KEY';
app.post('/summarize_url', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { url, languages } = req.body;
        // Perform web scraping to extract relevant data from the webpage
        const extractedData = yield (0, webScraper_1.scrapeData)(url);
        // Perform translation using the selected translation service
        const translatedData = yield translateData(extractedData, languages);
        // Generate customized summaries for each language
        const summaries = yield generateSummaries(url, languages, translatedData, extractedData);
        res.status(200).json({ summaries });
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
}));
// Simulated function for translation
function translateData(data, languages) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Simulate translation using an external translation service or library
            // Implement your translation logic here
            // ...
            // Return the translated data
            return Object.assign(Object.assign({}, data), { translatedContent: 'Translated Content' });
        }
        catch (error) {
            console.error('Error translating data:', error);
            throw error;
        }
    });
}
// Simulated function for generating summaries
function generateSummaries(url, languages, translatedData, extractedData) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Prepare input for the ChatGPT API
            const prompt = `URL: ${url}\n\nExtracted Data:\n${JSON.stringify(extractedData, null, 2)}\n\n`;
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
        }
        catch (error) {
            console.error('Error generating summaries:', error);
            throw error;
        }
    });
}
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
