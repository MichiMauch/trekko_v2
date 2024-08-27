import puppeteer from 'puppeteer';

export default async function handler(req, res) {
  const { url } = req.query;
  
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    // Gehe zur URL und warte auf das Netzwerk-Idle-Ereignis
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Versuche sicherzustellen, dass React die Seite vollständig gerendert hat
    await page.waitForFunction(() => {
      return !!document.querySelector('.leaflet-container');
    }, { timeout: 10000 }); // Warte bis zu 10 Sekunden

    const mapElement = await page.$('.leaflet-container');
    if (mapElement) {
      const screenshot = await mapElement.screenshot();
      await browser.close();

      res.setHeader('Content-Type', 'image/png');
      res.send(screenshot);
    } else {
      await browser.close();
      res.status(404).json({ error: 'Map element not found' });
    }
  } catch (error) {
    console.error('Error during screenshot creation:', error.message);
    res.status(500).json({ error: `Failed to take screenshot: ${error.message}` });
  }
}
