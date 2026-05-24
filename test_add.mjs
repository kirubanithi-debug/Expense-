import puppeteer from 'puppeteer';

(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    page.on('console', msg => console.log('[BROWSER LOG]', msg.text()));
    page.on('pageerror', error => console.error('[BROWSER ERROR]', error.message));

    console.log('Navigating to http://localhost:5173/ ...');
    await page.goto('http://localhost:5173/');
    
    await new Promise(r => setTimeout(r, 2000));
    
    // Login if needed
    try {
        await page.type('input[type="email"]', 'admin@gmail.com');
        await page.type('input[type="password"]', 'Admin@123');
        await page.click('button[type="submit"]');
        await new Promise(r => setTimeout(r, 2000));
        console.log('Logged in.');
    } catch (e) {
        console.log('Already logged in or no login form.');
    }

    // Wait for Dashboard
    await new Promise(r => setTimeout(r, 2000));
    
    try {
        // Find manual add button
        const fabManual = await page.$('.fab-manual');
        if (fabManual) {
            console.log('Clicking .fab-manual');
            await fabManual.click();
        } else {
            console.log('No .fab-manual found!');
            // try looking for it by text?
        }
        
        await new Promise(r => setTimeout(r, 2000));
        
        // Find amount input
        console.log('Typing amount...');
        await page.type('input[type="number"]', '555');
        
        console.log('Submitting form...');
        await page.click('button[type="submit"]');
        
        await new Promise(r => setTimeout(r, 2000));
        console.log('Add done!');
    } catch (e) {
        console.error('Error during add flow:', e);
    }
    
    await browser.close();
})();
