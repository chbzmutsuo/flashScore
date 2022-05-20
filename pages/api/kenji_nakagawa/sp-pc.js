export default function spPc(req, res) {

	const puppeteer = require('puppeteer');
	const URL = req.body.url;

	const options = {
		args: ['--no-sandbox', '-disable-setuid-sandbox'],
		headless: false,
		slowMo: 30
	};

	const imageToBase64 = require('image-to-base64');
	//or
	//import imageToBase64 from 'image-to-base64/browser';



	(async () => {
		const browser = await puppeteer.launch(options)

		/**PC */
		const page = await browser.newPage()
		await page.goto(URL, { waitUntil: 'networkidle2', });
		const pcPicBASE64 = await picSite('sp', page);

		/**スマホ */
		const page2 = await browser.newPage()
		await page2.goto(URL, { waitUntil: 'networkidle2', });
		await page2.emulate(puppeteer.devices['iPhone 5'])
		const spPicBASE64 = await picSite('pc', page2);

		await page.waitForTimeout(5000);
		// const url = await page.url()
		console.log(page.url(), page2.url())   //////////







		// const divCount = await getHtml();
		await browser.close()





		async function picSite(device, page) {
			let SCREENSHOT_PATH = `public/images/${device}/${device}.png`
			await page.screenshot({ path: SCREENSHOT_PATH })
			return await imageToBase64(SCREENSHOT_PATH).then(
				(response) => {
					// console.log(response); // "cGF0aC90by9maWxlLmpwZw=="
					return response
				}
			).catch(
				(error) => {
					// console.error(error); // Logs an error if there was one
				}
			)


			// SCREENSHOT_PATH = SCREENSHOT_PATH.replace("public", "")

		}


		// async function getHtml() {
		// 	await page.goto('https://www.amazon.co.jp/ref=nav_logo', { waitUntil: 'networkidle2', });
		// 	const h1 = await page.$$("h1");
		// 	const h2 = await page.$$("h2");
		// 	const h3 = await page.$$("h3");

		// 	return { h1: h1.length, h2: h2.length, h3: h3.length }
		// }

		return { pcPicBASE64, spPicBASE64 }

	})().then(result => {
		return res.json({ result })
	})


}
