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
    
    console.log('Clicking the manual add button in Dashboard Header (Record Expense)...');
    try {
        // Find Record Expense button in Dashboard
        const buttons = await page.$$('button');
        let recordBtn;
        for (const btn of buttons) {
            const text = await page.evaluate(el => el.textContent, btn);
            if (text.includes('Record Expense')) recordBtn = btn;
        }
        if (recordBtn) {
            await recordBtn.click();
            console.log('Clicked Record Expense.');
        } else {
            console.log('Could not find Record Expense button.');
            
            console.log('Trying to click fab-manual instead...');
            const fabManual = await page.$('.fab-manual');
            if (fabManual) {
                await fabManual.click();
            }
        }
    } catch (e) {
        console.error('Error clicking:', e);
    }
    
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: 'modal_open.png' });
    console.log('Screenshot saved as modal_open.png');
    
    // Fill the form
    try {
        console.log('Typing amount...');
        await page.type('input[type="number"]', '777');
        
        console.log('Clicking submit...');
        const submitBtn = await page.$('button[type="submit"]');
        if (submitBtn) {
            await submitBtn.click();
            console.log('Clicked submit');
        } else {
            console.log('Submit button not found!');
        }
    } catch (e) {
        console.error('Error in form:', e);
    }
    
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: 'after_submit.png' });
    console.log('Screenshot saved as after_submit.png');

    await browser.close();
})();
