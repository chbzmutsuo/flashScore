import { match } from 'assert';

const puppeteer = require('puppeteer');




export default async function getTeamScors(req, res) {
	try {
		// let url = "https://www.flashscore.co.jp/team/schio/h4Y1lKRQ/";
		let url = req.body.url
		const options = {
			args: ['--no-sandbox'],
			// executablePath: "",
			// defaultViewport: null,
			// headless: false, // ヘッドレスをオフに
			// slowMo: 100  // 動作を遅く
		};
		const browser = await puppeteer.launch(options);
		const page = await browser.newPage();
		await page.goto(url);
		/**ｈtmlからデータを解析し、JSONにする */
		setTimeout(async () => {
			const matches = await page.$$('div.event__match');
			try {

				let data = [];
				for (let i = 0; i < matches.length; i++) {
					const matches = await page.$$('div.event__match');
					const home = await getTextFromElementArray(matches[i], 'div.event__participant--home')
					const away = await getTextFromElementArray(matches[i], 'div.event__participant--away')
					const eventTime = await getTextFromElementArray(matches[i], 'div.event__time')


					const wld = await getTextFromElementArray(matches[i], 'span.wld')

					const homeScore = await getTextFromElementArray(matches[i], 'div.event__score--home')
					const awatScore = await getTextFromElementArray(matches[i], 'div.event__score--away')
					data.push({ home, away, eventTime, wld, homeScore, awatScore, })

					if (i === matches.length - 1) {
						await browser.close()
						return res.json({ data })
					}
				}

				// let data = [];
				// const matches = await page.$$('div.event__match');

				// matches.forEach(async match => {
				// 	const home = await getTextFromElementArray(match, 'div.event__participant--home')
				// 	data.push({ home, })
				// 	console.log(data)
				// 	return res.json({ data })
				// })
			} catch (error) {
				console.error(error)
				await browser.close()
				return res.json({ msg: 'errorが起きました' })

			}

		}, 100);




	} catch (error) {
		console.error(error)
		res.json({ msg: 'エラーが発生しました' })
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
