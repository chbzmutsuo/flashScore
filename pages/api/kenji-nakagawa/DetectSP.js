import { getBlob } from '../../../lib/blob';
import { fsync, readFileSync } from 'fs';

const puppeteer = require('puppeteer')



export default async function DetectSP(req, res) {
	const URL = "https://www.rakuten.co.jp/"

	try {
		let url = req.body.url
		const options = {
			args: ['--no-sandbox', '-disable-setuid-sandbox'],
			// executablePath: "",
			// defaultViewport: null,
			headless: false, // ヘッドレスをオフに
			slowMo: 100  // 動作を遅く
		};
		const device = puppeteer.devices['iPhone 5'];

		puppeteer.launch().then(async browser => {
			const page = await browser.newPage();
			await page.emulate(device);
			await page.goto(URL);
			const spImgPath = `public/images/screenshot_sp_${new Date()}.png`
			await page.screenshot({ path: spImgPath });


			const page2 = await browser.newPage();
			await page2.goto(URL);
			const pcImgPath = `public/images/screenshot_pc_${new Date()}.png`
			await page2.screenshot({ path: pcImgPath });

			browser.close();
			return res.status(200).send({ msg: 'success', result: { url: URL, spImgPath, pcImgPath } })
		});






	} catch (error) {
		console.error(error)
		res.json({ msg: 'エラーが発生しました' })
	}


}

