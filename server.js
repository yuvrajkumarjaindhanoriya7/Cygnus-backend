const express = require('express');
const cors = require('cors');
const { chromium } = require('playwright'); // 1. Import Playwright
const app = express();

const PORT = process.env.PORT || 3000; 

app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Main API Route
app.post('/run-automation', async (req, res) => {
    const { prompt } = req.body;
    console.log("Starting automation for prompt:", prompt);
    
    // 2. Add the actual automation logic
    try {
        // Launch a headless browser (headless: true is required in the cloud)
        const browser = await chromium.launch({ headless: true });
        const page = await browser.newPage();
        
        // Go to Google
        await page.goto('https://www.google.com');
        
        if (prompt) {
            // Find search box, fill it with the prompt, and press Enter
            const searchBox = await page.waitForSelector('textarea[name="q"], input[name="q"]');
            await searchBox.fill(prompt);
            await searchBox.press('Enter');
            
            // Wait for results to load
            await page.waitForNavigation();
        }
        
        // Get the title of the page to prove it worked
        const pageTitle = await page.title();
        await browser.close();
        
        // Send success response back to Netlify
        res.json({ 
            success: true, 
            message: `Automation complete! Scraped Page Title: ${pageTitle}`,
            receivedPrompt: prompt 
        });

    } catch (error) {
        console.error("Automation failed:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
