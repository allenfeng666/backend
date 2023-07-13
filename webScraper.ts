import * as puppeteer from 'puppeteer';

export async function scrapeData(url: string): Promise<any> {
  try {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.goto(url); // Pass the URL directly without encoding

    // Extract the relevant data from the webpage
    const title = await page.title();
    const htmlContent = await page.content();
    await browser.close();

    // Return the extracted data
    return {
      url,
      title,
      htmlContent,
      // Add other extracted fields as needed
    };
  } catch (error) {
    console.error('Error scraping data:', error);
    throw error;
  }
}
