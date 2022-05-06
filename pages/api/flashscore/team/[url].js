import axios from "axios";
import { syncBuiltinESMExports } from "module";
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');




export default async function getTeamScors(req, res) {
	try {
		const url = "https://www.flashscore.co.jp/team/schio/h4Y1lKRQ/";

		// (async () => {
		const options = {
			executablePath: "'/path/to/Chrome'",
			defaultViewport: null,

			// headless: false, // ヘッドレスをオフに
			// slowMo: 100  // 動作を遅く

		};
		const browser = await puppeteer.launch(options);


		const page = await browser.newPage();
		await page.goto(url);

		setTimeout(async () => {
			const html = await page.content()
			console.log({ html })   //////////
			return res.json({ html })
		}, 1000);




		const parse = async () => {
			const elems = await page.$$('div.event__match');
			let result = [];

			let i = 0;
			elems.forEach(async elem => {
				let home, away, homeScore, awayScore, winLose
				let text = await getText(elem);

				// homeElems = homeElems[0]
				home = await getTextFromElementArray(elem, "div.event__participant--home")
				away = await getTextFromElementArray(elem, "div.event__participant--away")
				homeScore = await getTextFromElementArray(elem, "div.event__score--home")
				awayScore = await getTextFromElementArray(elem, "div.event__score--away")
				winLose = await getTextFromElementArray(elem, "span.wld")

				result.push({ home, away, homeScore, awayScore, winLose })

			})
			return result;
		}

		setTimeout(async () => {
			const data = await parse();
			console.log({ data })   //////////

		}
			, 2000);

		// await browser.close();
		// setInterval(() => {
		// }, 10000);

		// })();

	} catch (error) {
		console.error(error)
		res.status(500).json({ error: error })
	}
}




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
