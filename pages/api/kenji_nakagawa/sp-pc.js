export default function spPc(req, res) {

	const puppeteer = require('puppeteer');
	const URL = req.body.url;

	const options = {
		args: ['--no-sandbox', '-disable-setuid-sandbox'],
		// headless: false,
		// slowMo: 30
	};

	(async () => {
		const browser = await puppeteer.launch(options)

		const page = await browser.newPage()

		await page.goto(URL, { waitUntil: 'networkidle2', });
		const pcPicPath = await picSite('sp', page);

		/**スマホ */
		await page.emulate(puppeteer.devices['iPhone 5'])
		// await page.goto('https://www.amazon.co.jp/ref=nav_logo', { waitUntil: 'networkidle2', });
		const spPicPath = await picSite('pc', page);





		// const divCount = await getHtml();
		await browser.close()




		async function getHtml() {
			await page.goto('https://www.amazon.co.jp/ref=nav_logo', { waitUntil: 'networkidle2', });
			const h1 = await page.$$("h1");
			const h2 = await page.$$("h2");
			const h3 = await page.$$("h3");

			return { h1: h1.length, h2: h2.length, h3: h3.length }
		}


		async function picSite(device, page) {
			let SCREENSHOT_PATH = `public/images/${device}/${Date.now()}-${device}.png`
			await page.screenshot({ path: SCREENSHOT_PATH })
			return SCREENSHOT_PATH.replace("public", "")
		}


		// await page.reload()
		// // await page.waitForNetworkIdle({ idleTime: 2000, timeout: 10000 })
		// // await page.waitForNavigation()
		// page.on('dialog', async dialog => {
		// 	console.log('on dialog', dialog)   //////////

		// })

		return { pcPicPath, spPicPath }

	})().then(result => {
		console.log(result)   //////////
		return res.json({ result })
	})


}
