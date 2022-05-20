
import axios from "axios";
import { resolve } from "path";
const puppeteer = require('puppeteer');







export default async function Index(req, res) {
	let items = [];
	let data;
	const shopName = req.query.query[0]
	const searchWord = req.query.query[1]



	const options = {
		args: ['--no-sandbox', '-disable-setuid-sandbox'],
	};
	const browser = await puppeteer.launch(options);
	const page = await browser.newPage();

	//データの取得
	const URL = `https://paypaymall.yahoo.co.jp/store/zozo/search/?p=&X=4&b=0`

	setTimeout(async () => {
		const html = await page.goto(URL);
		await page.screenshot({ path: "screenshot.png" });


		const test = await page.$$('.ListItem_title');

		console.log(test.length)   //////////
		try {

			let data = [];
			for (let i = 0; i < test.length; i++) {
				// const home = await getTextFromElementArray(matches[i], 'div.event__participant--home')
				// const away = await getTextFromElementArray(matches[i], 'div.event__participant--away')
				// const eventTime = await getTextFromElementArray(matches[i], 'div.event__time')


				// const wld = await getTextFromElementArray(matches[i], 'span.wld')

				// const homeScore = await getTextFromElementArray(matches[i], 'div.event__score--home')
				// const awatScore = await getTextFromElementArray(matches[i], 'div.event__score--away')
				// data.push({ home, away, eventTime, wld, homeScore, awatScore, })

				// if (i === matches.length - 1) {
				// 	await browser.close()
				// 	return res.json({ data })
				// }
			}
		} catch (error) {
			console.error(error)
			await browser.close()
			return res.json({ msg: 'errorが起きました' })

		}

		browser.close();

		return res.json({ test })

	}, 3000);






	async function getText(elem) {
		let result;
		let jsHadnle = await elem.getProperty('textContent');
		result = await jsHadnle.jsonValue();
		return result;
	}


	//**親要素の中でselector検索を行い、テクストを返す */
	async function getTextFromElementArray(parent, selector) {
		try {
			const elems = await parent.$$(selector);
			const elem = elems[0]
			return await getText(elem)
		} catch (error) {
			console.error(error)   //////////
			return 'error'
		}

	}
}
